import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash-es';
import { EffectAllowed } from 'ngx-drag-drop';
import { BehaviorSubject } from 'rxjs';
import { CreateComponentDialogComponent } from '../components/content-components/components/create-component-dialog/create-component-dialog.component';
import { ComponentAction, ContentComponentType } from '../enums';
import { IRowCols } from '../interfaces';
import {
  IBody,
  IBodyValues,
  IButtonValue,
  IColumn,
  IColumnValues,
  IContent,
  IDividerValues,
  IEventValue,
  IHeadValue,
  IHtmlValue,
  IImageValue,
  ILayout,
  IMenuValue,
  IRow,
  IRowIndexInfo,
  IRowValues,
  ITextValue,
  ITypedContent,
  IVariableValue,
  UserEditableBlocks,
} from '../layout-schema/layout-schema.interface';
import { DragAndDropData } from '../types/drag-and-drop-data.type';
import { EventRowType } from '../types/event-row-type';
import { uuidv4 } from '../utils/uuid';
import { BodyHandlerService } from './body-handler.service';
import { ButtonHandlerService } from './button-handler.service';
import { DividerHandlerService } from './divider-handler.service';
import { HeadHandlerService } from './head-handler.service';
import { HtmlHandlerService } from './html-handler.service';
import { ImageHandlerService } from './image-handler.service';
import { InitialValuesService } from './initial-values.service';
import { LayoutStateService } from './layout-state.service';
import { LayoutUndoRedoService } from './layout-undo-redo.service';
import { MenuHandlerService } from './menu-handler-service.service';
import { RowHandlerService } from './row-handler.service';
import { TextHandlerService } from './text-handler.service';
import { VariablesHandlerService } from './variables-handler.service';
import { VariableContextType } from '../types/variable-context.type';

@Injectable()
export class LayoutHandlerService {

  /**
   * Hold the layout information
   */
  private templateId = new BehaviorSubject<string | null>(null);
  templateId$ = this.templateId.asObservable();

  private componentId = new BehaviorSubject<string | null>(null);
  componentId$ = this.componentId.asObservable();

  private layoutId = new BehaviorSubject<string | null>(null);
  layoutId$ = this.layoutId.asObservable();

  public initialLayout: ILayout | null;

  /**
   * Holds information about what content type is currently edited by the user.
   */
  private activeContentComponentTypeForEdit = new BehaviorSubject<ContentComponentType | null>(null);
  public activeContentComponentTypeForEdit$ = this.activeContentComponentTypeForEdit.asObservable();

  /**
   * Always holds the last selected content id. It's needed to update that block later.
   */
  private lastSelectedContentId = new BehaviorSubject<string | null>(null);
  public lastSelectedContentId$ = this.lastSelectedContentId.asObservable();

  private lastSelectedContentLocked = new BehaviorSubject<boolean>(false);
  public lastSelectedContentLocked$ = this.lastSelectedContentLocked.asObservable();

  constructor(
    private variablesHandlerService: VariablesHandlerService,
    private textHandlerService: TextHandlerService,
    private imageHandlerService: ImageHandlerService,
    private layoutUndoRedoService: LayoutUndoRedoService,
    private layoutStateService: LayoutStateService,
    private buttonHandlerService: ButtonHandlerService,
    private headHanlderService: HeadHandlerService,
    private htmlHandlerService: HtmlHandlerService,
    private initialValuesService: InitialValuesService,
    private menuHandlerService: MenuHandlerService,
    private bodyHandlerService: BodyHandlerService,
    private rowHandlerService: RowHandlerService,
    private dividerHandlerService: DividerHandlerService,
    private dialog: MatDialog
  ) { }

  setTemplateId(id: string): void {
    this.templateId.next(id);
  }

  setComponentId(id: string): void {
    this.componentId.next(id);
  }

  setLayoutId(id: string): void {
    this.layoutId.next(id);
  }

  getLayoutId(): string {
    return this.layoutId.getValue() || '';
  }

  getTemplateId(): string {
    return this.templateId.getValue() || '';
  }

  get isTemplate(): boolean {
    return this.templateId.getValue() !== null;
  }

  /**
   * Setting up the layout initially.
   * @param layoutJson
   */
  setInitialLayoutJson(layoutJson: ILayout | null): void {
    // NOTE: if service initialized with null value, we work with a minimal initial structure.

    this.layoutUndoRedoService.emptyQueues();
    this.layoutUndoRedoService.addToUndoQueue(layoutJson ? layoutJson : this.initialValuesService.INITIAL_LAYOUT);

    this.layoutStateService.addNewLayoutVersion(layoutJson ? layoutJson : this.initialValuesService.INITIAL_LAYOUT);
  }

  /**
   * After every user edits, this method must be used to update the current layout.
   * This handles undo & redo logic.
   * @param updatedLayout
   */
  private updateLayoutJson(updatedLayout: ILayout): void {
    this.layoutUndoRedoService.addToUndoQueue(updatedLayout);
    // NOTE: After any user edits we have to empty the redo queue.
    this.layoutUndoRedoService.emptyRedoQueue();

    this.layoutStateService.addNewLayoutVersion(updatedLayout);
  }

  getCurrentLayout(): ILayout | null {
    return this.layoutStateService.getCurrentLayout();
  }

  handleContentLayout(action: ComponentAction) {
    const lastSelectedContentId = this.getLastSelectedContentId();

    const layoutCopy = this.getLayoutCopy();
    const selectedBlock = this.findBlockById(layoutCopy, lastSelectedContentId);

    if (!selectedBlock || !lastSelectedContentId) {
      return;
    }

    const isRowBlock = this.isRow(selectedBlock);

    if (isRowBlock) {
      const rowCopy = cloneDeep(selectedBlock);
      const rowIndexInfo = this.findRowsById(layoutCopy, lastSelectedContentId);
      const rowCopyWithNewIds = this.updateIdsForRow(rowCopy);

      if (!rowIndexInfo) {
        return;
      }

      if (action === ComponentAction.DUPLICATE) {
        rowIndexInfo.rowsPointer.splice(rowIndexInfo.rowIndex, 0, rowCopyWithNewIds);
      } else if (action === ComponentAction.REMOVE) {
        rowIndexInfo.rowsPointer.splice(rowIndexInfo.rowIndex, 1);
      } else if (action === ComponentAction.PADLOCK) {
        rowIndexInfo.rowsPointer[rowIndexInfo.rowIndex].values.locked = !rowIndexInfo.rowsPointer[rowIndexInfo.rowIndex].values.locked;
        this.setLastSelectedContentLocked(rowIndexInfo.rowsPointer[rowIndexInfo.rowIndex]);
      } else if (action === ComponentAction.ADD) {
        this.createNewComponent(layoutCopy.body.rows[rowIndexInfo.rowIndex]);
      }
    } else {
      const blockCopy = cloneDeep(selectedBlock) as IContent;
      const targetColumn = this.findColumnByContentId(layoutCopy, blockCopy.id) as IColumn;
      const blockIndex = this.calculateContentIndex(targetColumn, blockCopy.id);
      const blockCopyWithNewIds = this.updateIdsForBlock(blockCopy);

      if (action === ComponentAction.DUPLICATE) {
        targetColumn.contents.splice(blockIndex, 0, blockCopyWithNewIds);
      } else if (action === ComponentAction.REMOVE) {
        targetColumn.contents.splice(blockIndex, 1);
      } else if (action === ComponentAction.PADLOCK) {
        targetColumn.contents[blockIndex].values.locked = !targetColumn.contents[blockIndex].values.locked;
        this.setLastSelectedContentLocked(targetColumn.contents[blockIndex]);
      }
    }

    this.updateLayoutJson(layoutCopy);
  }

  calculateRowIndex(rows: IRow[], rowId: string): number {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      if (rows[rowIndex].id === rowId) {
        return rowIndex;
      }
    }

    return 0;
  }

  calculateContentIndex(column: IColumn, id: string) {
    let columnIndex = 0;

    for (let contentIndex = 0; contentIndex < column.contents.length; contentIndex++) {
      const content = column.contents[contentIndex];

      if (content.id === id) {
        columnIndex = contentIndex;
      }
    }

    return columnIndex;
  }

  updateIdsForBlock(selectedContent: IContent) {
    return { ...selectedContent, id: uuidv4() };
  }

  updateIdsForRow(selectedContent: IRow) {
    return {
      ...selectedContent,
      id: uuidv4(),
      columns: selectedContent.columns.map(column => ({
        ...column,
        id: uuidv4(),
        contents: column.contents.map(content => ({ ...content, id: uuidv4() })),
      })),
    };
  }

  /**
   * Handles when user is selecting a block to edit.
   * @param id
   */
  handleBlockSelect(id: string) {
    const selectedBlock = this.findBlockById(this.getCurrentLayout(), id);

    if (selectedBlock) {
      this.setLastSelectedContentId(id);
      this.setLastSelectedContentLocked(selectedBlock);
      this.populateConfigFormValue(selectedBlock);
      this.setActiveConfigFormForBlock(selectedBlock);
    }
  }

  selectBody() {
    const layout = this.getCurrentLayout();
    if (!layout) {
      return;
    }
    this.handleBlockSelect(layout.body.id || '');
  }

  private setLastSelectedContentId(id: string): void {
    this.lastSelectedContentId.next(id);
  }

  private setLastSelectedContentLocked(content: UserEditableBlocks): void {
    if ('values' in content && 'locked' in content.values) {
      this.lastSelectedContentLocked.next(content.values.locked);
    }
  }

  private getLastSelectedContentId(): string | null {
    return this.lastSelectedContentId.value;
  }

  private populateConfigFormValue(selectedBlock: UserEditableBlocks): void {
    if (this.isVariableContent(selectedBlock)) {
      this.variablesHandlerService.setCurrentValues(selectedBlock.values);
    } else if (this.isTextContent(selectedBlock)) {
      this.textHandlerService.setCurrentValues(selectedBlock.values);
    } else if (this.isImageContent(selectedBlock)) {
      this.imageHandlerService.setCurrentValues(selectedBlock.values);
    } else if (this.isButtonContent(selectedBlock)) {
      this.buttonHandlerService.setCurrentValues(selectedBlock.values);
    } else if (this.isMenuContent(selectedBlock)) {
      this.menuHandlerService.setCurrentValues(selectedBlock.values);
    } else if (this.isHeadContent(selectedBlock)) {
      this.headHanlderService.setCurrentValues(selectedBlock.values);
    } else if (this.isHtmlContent(selectedBlock)) {
      this.htmlHandlerService.setCurrentValues(selectedBlock.values);
    } else if (this.isRow(selectedBlock)) {
      this.rowHandlerService.setCurrentRow(selectedBlock);
    } else if (this.isBodyContent(selectedBlock)) {
      this.bodyHandlerService.setCurrentValues(selectedBlock.values);
    } else if (this.isDividerContent(selectedBlock)) {
      this.dividerHandlerService.setCurrentValues(selectedBlock.values);
    }
  }

  /**
   * Updates `activeContentComponentTypeForEdit` Subject with the selected block's type if any.
   * @param selectedBlock
   */
  private setActiveConfigFormForBlock(selectedBlock: UserEditableBlocks): void {
    if ((<IContent>selectedBlock).type) {
      this.activeContentComponentTypeForEdit.next((<IContent>selectedBlock).type);
    } else {
      this.activeContentComponentTypeForEdit.next(ContentComponentType.BLOCK);
    }
  }

  /**
   * Walks through the entire JSON structure to find the block with given `id`.
   * @param layout
   * @param id: id to search for
   */
  private findBlockById(layout: ILayout | null, id: string | null): UserEditableBlocks | null {
    if (!layout) {
      return null;
    }

    if (layout.body.id === id) {
      return layout.body;
    }

    return this.findBlockByIdInRows(layout.body.rows, id);
  }

  private findBlockByIdInRows(rows: IRow[], id: string | null): UserEditableBlocks | null {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      if (row.id === id) {
        return row;
      }

      for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
        const column = row.columns[columnIndex];

        if (column.id === id) {
          return column;
        }

        for (let contentIndex = 0; contentIndex < column.contents.length; contentIndex++) {
          const content = column.contents[contentIndex];

          if (content.id === id) {
            return content;
          }

          // NOTE: for Event block, we have to check in the values also
          if (this.isEventContent(content)) {
            const foundEventBlock = this.findBlockByIdInRows(content.values.eventRows, id);
            if (foundEventBlock) {
              return foundEventBlock;
            }

            const foundTopBlock = this.findBlockByIdInRows(content.values.ticketTopRows, id);
            if (foundTopBlock) {
              return foundTopBlock;
            }

            const foundTicketBlock = this.findBlockByIdInRows(content.values.ticketTicketRows, id);
            if (foundTicketBlock) {
              return foundTicketBlock;
            }

            const foundBottomBlock = this.findBlockByIdInRows(content.values.ticketBottomRows, id);
            if (foundBottomBlock) {
              return foundBottomBlock;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * For a given row block id returns the row array where that item belongs.
   * @param rows
   * @param rowId
   */
  private findEventRowArrayByRowId(rows: IRow[], rowId: string): IRowIndexInfo | null {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
        const column = row.columns[columnIndex];

        for (let contentIndex = 0; contentIndex < column.contents.length; contentIndex++) {
          const content = column.contents[contentIndex];

          if (this.isEventContent(content)) {
            const foundEventBlock = this.findBlockByIdInRows(content.values.eventRows, rowId);
            if (foundEventBlock) {
              return {
                rowsPointer: content.values.eventRows,
                rowIndex: this.calculateRowIndex(content.values.eventRows, rowId),
              };
            }

            const foundTopBlock = this.findBlockByIdInRows(content.values.ticketTopRows, rowId);
            if (foundTopBlock) {
              return {
                rowsPointer: content.values.ticketTopRows,
                rowIndex: this.calculateRowIndex(content.values.ticketTopRows, rowId),
              };
            }

            const foundTicketBlock = this.findBlockByIdInRows(content.values.ticketTicketRows, rowId);
            if (foundTicketBlock) {
              return {
                rowsPointer: content.values.ticketTicketRows,
                rowIndex: this.calculateRowIndex(content.values.ticketTicketRows, rowId),
              };
            }

            const foundBottomBlock = this.findBlockByIdInRows(content.values.ticketBottomRows, rowId);
            if (foundBottomBlock) {
              return {
                rowsPointer: content.values.ticketBottomRows,
                rowIndex: this.calculateRowIndex(content.values.ticketBottomRows, rowId),
              };
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Walks through the entire JSON structure to find the column where the with given `blockId` belongs.
   * @param layout
   * @param blockId: id to search for
   */
  private findColumnByContentId(layout: ILayout | null, blockId: string): IColumn | null {
    if (!layout) {
      return null;
    }

    return this.findColumnByContentIdInRows(layout.body.rows, blockId);
  }

  private findColumnByContentIdInRows(rows: IRow[], blockId: string): IColumn | null {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
        const column = row.columns[columnIndex];

        for (let contentIndex = 0; contentIndex < column.contents.length; contentIndex++) {
          const content = column.contents[contentIndex];

          if (content.id === blockId) {
            return column;
          }

          // NOTE: for event type content, we have to look for further rows.
          if (this.isEventContent(content)) {
            const foundTicketTopColumn = this.findColumnByContentIdInRows(content.values.ticketTopRows, blockId);

            if (foundTicketTopColumn) {
              return foundTicketTopColumn;
            }

            const foundTicketTicketColumn = this.findColumnByContentIdInRows(content.values.ticketTicketRows, blockId);

            if (foundTicketTicketColumn) {
              return foundTicketTicketColumn;
            }

            const foundTicketBottomColumn = this.findColumnByContentIdInRows(content.values.ticketBottomRows, blockId);

            if (foundTicketBottomColumn) {
              return foundTicketBottomColumn;
            }

            const foundEventColumn = this.findColumnByContentIdInRows(content.values.eventRows, blockId);

            if (foundEventColumn) {
              return foundEventColumn;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Finds body in the current JSON layout, and updates the vales with `newValues`.
   *
   * @param newValues
   */
  updateBodyValues(newValues: IBodyValues) {
    const layoutCopy = this.getLayoutCopy();

    layoutCopy.body.values.contentAlignment = newValues.contentAlignment;
    layoutCopy.body.values.contentWidth = newValues.contentWidth;
    layoutCopy.body.values.textColor = newValues.textColor;
    layoutCopy.body.values.backgroundColor = newValues.backgroundColor;
    layoutCopy.body.values.fontFamily = newValues.fontFamily;
    layoutCopy.body.values.linkColor = newValues.linkColor;
    layoutCopy.body.values.underline = newValues.underline;

    this.updateLayoutJson(layoutCopy);
  }

  /**
   * Finds a row in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   * @param columnConfigs
   */
  updateRowValues(newValues: IRowValues, columnConfigs: IColumnValues[]) {
    if (!this.lastSelectedContentId) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isRow(block)) {
      block.values.backgroundColor = newValues.backgroundColor;
      block.values.contentBackgroundColor = newValues.contentBackgroundColor;
      block.values.backgroundRepeat = newValues.backgroundRepeat;
      block.values.backgroundPosition = newValues.backgroundPosition;
      block.values.backgroundImageUrl = newValues.backgroundImageUrl;
      block.values.paddingTop = newValues.paddingTop;
      block.values.paddingLeft = newValues.paddingLeft;
      block.values.paddingRight = newValues.paddingRight;
      block.values.paddingBottom = newValues.paddingBottom;

      columnConfigs.forEach((columnConfig: IColumnValues, index: number) => {
        block.columns[index].values.backgroundColor = columnConfig.backgroundColor;
        block.columns[index].values.paddingTop = columnConfig.paddingTop;
        block.columns[index].values.paddingLeft = columnConfig.paddingLeft;
        block.columns[index].values.paddingRight = columnConfig.paddingRight;
        block.columns[index].values.paddingBottom = columnConfig.paddingBottom;
        block.columns[index].values.borderTopColor = columnConfig.borderTopColor;
        block.columns[index].values.borderLeftColor = columnConfig.borderLeftColor;
        block.columns[index].values.borderRightColor = columnConfig.borderRightColor;
        block.columns[index].values.borderBottomColor = columnConfig.borderBottomColor;
        block.columns[index].values.borderTopStyle = columnConfig.borderTopStyle;
        block.columns[index].values.borderLeftStyle = columnConfig.borderLeftStyle;
        block.columns[index].values.borderRightStyle = columnConfig.borderRightStyle;
        block.columns[index].values.borderBottomStyle = columnConfig.borderBottomStyle;
        block.columns[index].values.borderTopWidth = columnConfig.borderTopWidth;
        block.columns[index].values.borderLeftWidth = columnConfig.borderLeftWidth;
        block.columns[index].values.borderRightWidth = columnConfig.borderRightWidth;
        block.columns[index].values.borderBottomWidth = columnConfig.borderBottomWidth;
        block.columns[index].values.borderAll = columnConfig.borderAll;
      });

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   */
  updateVariableBlockValues(newValues: IVariableValue) {
    if (!this.lastSelectedContentId) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isVariableContent(block)) {
      block.values.dateFormat = newValues.dateFormat;
      block.values.textColor = newValues.textColor;
      block.values.lineHeight = newValues.lineHeight;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
    * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
    *
    * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
    *
    * @param newValues
    */
  updateDividerValues(newValues: IDividerValues) {
    if (!this.lastSelectedContentId) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    const blockValues = <IDividerValues>(<IContent>block).values;

    if (block && this.isDividerContent(block)) {
      blockValues.width = newValues.width;
      blockValues.textAlign = newValues.textAlign;
      blockValues.paddingTop = newValues.paddingTop;
      blockValues.paddingBottom = newValues.paddingBottom;
      blockValues.paddingLeft = newValues.paddingLeft;
      blockValues.paddingRight = newValues.paddingRight;
      blockValues.borderTopColor = newValues.borderTopColor;
      blockValues.borderTopStyle = newValues.borderTopStyle;
      blockValues.borderTopWidth = newValues.borderTopWidth;

      this.updateLayoutJson(layoutCopy);
    }
  }


  /**
   * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   */
  updateTextBlockValues(newValues: ITextValue) {
    if (!this.getLastSelectedContentId()) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isTextContent(block)) {
      block.values.fontFamily = newValues.fontFamily;
      block.values.fontWeight = newValues.fontWeight;
      block.values.fontSize = newValues.fontSize;
      block.values.textColor = newValues.textColor;
      block.values.textAlign = newValues.textAlign;
      block.values.lineHeight = newValues.lineHeight;
      block.values.inheritBodyStyles = newValues.inheritBodyStyles;
      block.values.linkColor = newValues.linkColor;
      block.values.underline = newValues.underline;
      block.values.containerPadding = newValues.containerPadding;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   */
  updateHeadBlockValues(newValues: IHeadValue) {
    if (!this.getLastSelectedContentId()) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isHeadContent(block)) {
      block.values.headingType = newValues.headingType;
      block.values.fontFamily = newValues.fontFamily;
      block.values.fontWeight = newValues.fontWeight;
      block.values.fontSize = newValues.fontSize;
      block.values.textColor = newValues.textColor;
      block.values.lineHeight = newValues.lineHeight;
      block.values.textAlign = newValues.textAlign;
      block.values.inheritBodyStyles = newValues.inheritBodyStyles;
      block.values.linkColor = newValues.linkColor;
      block.values.underline = newValues.underline;
      block.values.containerPadding = newValues.containerPadding;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   */
  updateImageValues(newValues: IImageValue) {
    if (!this.getLastSelectedContentId()) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isImageContent(block)) {
      block.values.src = newValues.src;
      block.values.href = newValues.href;
      block.values.action = newValues.action;
      block.values.target = newValues.target;
      block.values.emailTo = newValues.emailTo;
      block.values.subject = newValues.subject;
      block.values.body = newValues.body;
      block.values.phone = newValues.phone;
      block.values.width = newValues.width;
      block.values.altText = newValues.altText;
      block.values.textAlign = newValues.textAlign;
      block.values.paddingTop = newValues.paddingTop;
      block.values.paddingBottom = newValues.paddingBottom;
      block.values.paddingLeft = newValues.paddingLeft;
      block.values.paddingRight = newValues.paddingRight;
      block.values.autoWidth = newValues.autoWidth;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   */
  updateButtonValues(newValues: IButtonValue) {
    if (!this.getLastSelectedContentId()) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isButtonContent(block)) {
      const blockValues = <IButtonValue>(<IContent>block).values;

      blockValues.fontFamily = newValues.fontFamily;
      blockValues.fontSize = newValues.fontSize;
      blockValues.textColor = newValues.textColor;
      blockValues.backgroundColor = newValues.backgroundColor;
      blockValues.lineHeight = newValues.lineHeight;
      blockValues.fontWeight = newValues.fontWeight;
      blockValues.href = newValues.href;
      blockValues.action = newValues.action;
      blockValues.target = newValues.target;
      blockValues.emailTo = newValues.emailTo;
      blockValues.subject = newValues.subject;
      blockValues.body = newValues.body;
      blockValues.phone = newValues.phone;
      blockValues.variable = newValues.variable;
      blockValues.width = newValues.width;
      blockValues.textAlign = newValues.textAlign;
      blockValues.paddingTop = newValues.paddingTop;
      blockValues.paddingBottom = newValues.paddingBottom;
      blockValues.paddingLeft = newValues.paddingLeft;
      blockValues.paddingRight = newValues.paddingRight;
      blockValues.containerPadding = newValues.containerPadding;
      blockValues.autoWidth = newValues.autoWidth;
      blockValues.borderTopColor = newValues.borderTopColor;
      blockValues.borderLeftColor = newValues.borderLeftColor;
      blockValues.borderRightColor = newValues.borderRightColor;
      blockValues.borderBottomColor = newValues.borderBottomColor;
      blockValues.borderTopStyle = newValues.borderTopStyle;
      blockValues.borderLeftStyle = newValues.borderLeftStyle;
      blockValues.borderRightStyle = newValues.borderRightStyle;
      blockValues.borderBottomStyle = newValues.borderBottomStyle;
      blockValues.borderTopWidth = newValues.borderTopWidth;
      blockValues.borderLeftWidth = newValues.borderLeftWidth;
      blockValues.borderRightWidth = newValues.borderRightWidth;
      blockValues.borderBottomWidth = newValues.borderBottomWidth;
      blockValues.borderTopLeftRadius = newValues.borderTopLeftRadius;
      blockValues.borderTopRightRadius = newValues.borderTopRightRadius;
      blockValues.borderBottomLeftRadius = newValues.borderBottomLeftRadius;
      blockValues.borderBottomRightRadius = newValues.borderBottomRightRadius;
      blockValues.borderAll = newValues.borderAll;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   */
  updateMenuValues(newValues: IMenuValue) {
    if (!this.getLastSelectedContentId()) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isMenuContent(block)) {
      const blockValues = <IMenuValue>(<IContent>block).values;

      blockValues.fontFamily = newValues.fontFamily;
      blockValues.fontSize = newValues.fontSize;
      blockValues.textColor = newValues.textColor;
      blockValues.linkColor = newValues.linkColor;
      blockValues.fontWeight = newValues.fontWeight;
      blockValues.layout = newValues.layout;
      blockValues.separator = newValues.separator;
      blockValues.textAlign = newValues.textAlign;
      blockValues.paddingTop = newValues.paddingTop;
      blockValues.paddingBottom = newValues.paddingBottom;
      blockValues.paddingLeft = newValues.paddingLeft;
      blockValues.paddingRight = newValues.paddingRight;
      blockValues.containerPadding = newValues.containerPadding;
      blockValues.menuItems = newValues.menuItems;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Finds a block in the current JSON layout, and if found, updates the vales with `newValues`.
   *
   * NOTE: This operation expects that the currently edited block's id is already set in `this.lastSelectedContentId`.
   *
   * @param newValues
   */
  updateHtmlValues(newValues: IHtmlValue): void {
    if (!this.getLastSelectedContentId()) {
      return;
    }

    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, this.getLastSelectedContentId());

    if (block && this.isHtmlContent(block)) {
      const blockValues = block.values;

      blockValues.htmlContent = newValues.htmlContent;
      blockValues.containerPadding = newValues.containerPadding;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Updates the text value for a Text block by id.
   * @param id - block id to update
   * @param newText
   */
  updateTextBlockText(id: string, newText: string): void {
    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, id);

    if (block && this.isTextContent(block)) {
      if (block.values.text === newText) {
        return;
      }

      block.values.text = newText;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Updates the text value for a Head block by id.
   * @param id - block id to update
   * @param newText
   */
  updateHeadBlockText(id: string, newText: string): void {
    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, id);

    if (block && this.isHeadContent(block)) {
      block.values.text = newText;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Updates the text value for a Button block by id.
   * @param id - block id to update
   * @param newText
   */
  updateButtonBlockText(id: string, newText: string): void {
    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, id);

    if (block && this.isButtonContent(block)) {
      if (block.values.text === newText) {
        return;
      }

      block.values.text = newText;

      this.updateLayoutJson(layoutCopy);
    }
  }

  /**
   * Adds a new row to the layout json.
   * @param componentType
   * @param index
   * @param dndData
   */
  handleCanvasDrop(
    componentType: ContentComponentType,
    index: number | undefined,
    dndData: DragAndDropData,
    dropEffect: EffectAllowed
  ) {
    const layoutCopy = this.getLayoutCopy();

    if (componentType === ContentComponentType.BLOCK) {
      if (dropEffect === 'copy') {
        const rowCells = dndData as IRowCols;
        layoutCopy.body.rows.splice(index || 0, 0, this.createNewRow(rowCells));
      } else if (dropEffect === 'move') {
        const row = this.findBlockById(layoutCopy, dndData as string) as IRow;
        layoutCopy.body.rows.splice(index || 0, 0, this.updateIdsForRow(row));

        const rowIndex = this.calculateRowIndex(layoutCopy.body.rows, row.id);
        layoutCopy.body.rows.splice(rowIndex, 1);
      }

      this.updateLayoutJson(layoutCopy);
    } else {
      const defaultRowCells = [1];
      const newRow = this.createNewRow(defaultRowCells);

      if (dropEffect === 'copy') {
        const component = this.createNewContent(componentType, dndData);

        if (component) {
          newRow.columns[0].contents = [component];
        }

        layoutCopy.body.rows.splice(index || 0, 0, newRow);

        this.updateLayoutJson(layoutCopy);
      } else if (dropEffect === 'move') {
        const component = this.findBlockById(layoutCopy, dndData as string) as IContent;
        newRow.columns[0].contents = [component];

        const prevColumn = this.findColumnByContentId(layoutCopy, dndData as string) as IColumn;
        const contentIndex = this.calculateContentIndex(prevColumn, dndData as string);
        prevColumn.contents.splice(contentIndex, 1);

        layoutCopy.body.rows.splice(index || 0, 0, newRow);
        this.updateLayoutJson(layoutCopy);
        this.handleBlockSelect(component.id);
      }
    }
  }

  handleEventContentDrop(eventBlockId: string,
    rowType: EventRowType,
    componentType: ContentComponentType,
    index: number | undefined,
    dndData: DragAndDropData,
    dropEffect: EffectAllowed) {
    const layoutCopy = this.getLayoutCopy();
    const eventBlock = this.findBlockById(layoutCopy, eventBlockId) as ITypedContent<IEventValue>;

    // NOTE: We only allow block type to be dropped here.
    if (!eventBlock || componentType !== ContentComponentType.BLOCK) {
      return;
    }

    const targetRowsToChange = this.determineTargetEventRow(eventBlock.values, rowType);

    if (dropEffect === 'copy') {
      const rowCells = dndData as IRowCols;
      targetRowsToChange.splice(index || 0, 0, this.createNewRow(rowCells));
    } else if (dropEffect === 'move') {
      const row = this.findBlockById(layoutCopy, dndData as string) as IRow;
      targetRowsToChange.splice(index || 0, 0, this.updateIdsForRow(row));

      // NOTE: remove from original location
      const rowIndexInfo = this.findRowsById(layoutCopy, row.id);
      if (rowIndexInfo) {
        rowIndexInfo.rowsPointer.splice(rowIndexInfo.rowIndex, 1);
      }
    }

    this.updateLayoutJson(layoutCopy);
  }

  private determineTargetEventRow(values: IEventValue, rowType: EventRowType): IRow[] {
    switch (rowType) {
      case 'event':
        return values.eventRows;
      case 'ticketTop':
        return values.ticketTopRows;
      case 'ticket':
        return values.ticketTicketRows;
      case 'ticketBottom':
        return values.ticketBottomRows;
      default:
        return values.eventRows;
    }
  }

  getVariableContext(id: string): VariableContextType | null {
    const layout = this.getCurrentLayout();

    if (!layout) {
      return null;
    }

    return this.getVariableContextInRows(layout.body.rows, id);
  }

  private getVariableContextInRows(rows: IRow[], id: string | null): VariableContextType | null {
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
        const column = row.columns[columnIndex];

        for (let contentIndex = 0; contentIndex < column.contents.length; contentIndex++) {
          const content = column.contents[contentIndex];

          if (content.id === id && this.isTextContent(content)) {
            return 'global';
          }

          // NOTE: for Event block, we have to check in the values also
          if (this.isEventContent(content)) {
            const foundEventBlock = !!this.getVariableContextInRows(content.values.eventRows, id);
            if (foundEventBlock) {
              return 'event';
            }

            const foundTopBlock = !!this.getVariableContextInRows(content.values.ticketTopRows, id);
            if (foundTopBlock) {
              return 'event';
            }

            const foundTicketBlock = !!this.getVariableContextInRows(content.values.ticketTicketRows, id);
            if (foundTicketBlock) {
              return 'ticket';
            }

            const foundBottomBlock = !!this.getVariableContextInRows(content.values.ticketBottomRows, id);
            if (foundBottomBlock) {
              return 'event';
            }
          }
        }
      }
    }

    return null;
  }

  addContentToColumn(
    column: IColumn,
    componentType: ContentComponentType,
    index: number | undefined,
    dndData: DragAndDropData,
    dropEffect: EffectAllowed
  ): void {
    const layoutCopy = this.getLayoutCopy();

    const block = this.findBlockById(layoutCopy, column.id) as IColumn;

    if (block) {
      if (dropEffect === 'copy') {
        const newContent = this.createNewContent(componentType as ContentComponentType, dndData);

        if (!newContent) {
          // Note: We could not construct content for some reason, maybe type is not jet supported.
          return;
        }

        block.contents.splice(index || 0, 0, newContent);
        this.updateLayoutJson(layoutCopy);
        this.handleBlockSelect(newContent.id);
      } else if (dropEffect === 'move') {
        const contentId = dndData as string;
        const content = this.findBlockById(layoutCopy, contentId) as IContent;

        // Add content to new column
        block.contents.splice(index || 0, 0, this.updateIdsForBlock(content));

        // Remove content from initial column
        const prevColumn = this.findColumnByContentId(layoutCopy, contentId) as IColumn;
        const contentIndex = this.calculateContentIndex(prevColumn, contentId);
        prevColumn.contents.splice(contentIndex, 1);

        this.updateLayoutJson(layoutCopy);
        this.handleBlockSelect(content.id);
      }
    }
  }

  /**
   * Creates a deep copy of the current layout json.
   * When we make any change on the structure we make a copy and update that data.
   */
  private getLayoutCopy(): ILayout {
    return cloneDeep(this.getCurrentLayout()) as ILayout;
  }

  /**
   * Constructs a row based on the given column width array.
   * @param rowCells - containing column width ratio-s
   * TODO: Move this to InitialValuesService
   */
  private createNewRow(rowCells: number[]): IRow {
    const columns: IColumn[] = rowCells.map(cellWidth => ({
      id: uuidv4(),
      type: ContentComponentType.COLUMN,
      width: cellWidth,
      contents: [],
      values: {},
    }));

    return {
      id: uuidv4(),
      type: ContentComponentType.BLOCK,
      columns: columns,
      values: {
        locked: false,
      },
    };
  }

  private createNewContent(componentType: ContentComponentType, dndData: DragAndDropData): IContent | undefined {
    const initialValues = this.initialValuesService.createInitialValuesForContentType(componentType, dndData);

    if (!initialValues) {
      return;
    }

    return {
      id: uuidv4(),
      type: componentType,
      values: initialValues,
    };
  }

  private createNewComponent(layout: IRow) {
    this.dialog.open(CreateComponentDialogComponent, {
      data: layout,
      autoFocus: false,
      panelClass: 'create-dialog',
    });
  }

  private isRow(content: UserEditableBlocks): content is IRow {
    return 'type' in content && content.type === ContentComponentType.BLOCK;
  }

  private isTextContent(content: UserEditableBlocks): content is ITypedContent<ITextValue> {
    return 'type' in content && content.type === ContentComponentType.TEXT;
  }

  private isVariableContent(content: UserEditableBlocks): content is ITypedContent<IVariableValue> {
    return 'type' in content && content.type === ContentComponentType.VARIABLE;
  }

  private isImageContent(content: UserEditableBlocks): content is ITypedContent<IImageValue> {
    return 'type' in content && content.type === ContentComponentType.IMAGE;
  }

  private isButtonContent(content: UserEditableBlocks): content is ITypedContent<IButtonValue> {
    return 'type' in content && content.type === ContentComponentType.BUTTON;
  }

  private isMenuContent(content: UserEditableBlocks): content is ITypedContent<IMenuValue> {
    return 'type' in content && content.type === ContentComponentType.MENU;
  }

  private isHeadContent(content: UserEditableBlocks): content is ITypedContent<IHeadValue> {
    return 'type' in content && content.type === ContentComponentType.HEAD;
  }

  private isHtmlContent(content: UserEditableBlocks): content is ITypedContent<IHtmlValue> {
    return 'type' in content && content.type === ContentComponentType.HTML;
  }

  private isBodyContent(content: UserEditableBlocks): content is IBody {
    return 'type' in content && content.type === ContentComponentType.BODY;
  }

  private isDividerContent(content: UserEditableBlocks): content is ITypedContent<IDividerValues> {
    return 'type' in content && content.type === ContentComponentType.DIVIDER;
  }

  private isEventContent(content: UserEditableBlocks): content is ITypedContent<IEventValue> {
    return 'type' in content && content.type === ContentComponentType.EVENT;
  }

  isLayoutUpdated(): boolean {
    return JSON.stringify(this.initialLayout) !== JSON.stringify(this.getCurrentLayout());
  }

  createLayoutForComponent(component: IRow): ILayout {
    const componentLayout = this.initialValuesService.INITIAL_LAYOUT;
    componentLayout.body.rows.push(component);
    return componentLayout;
  }

  private findRowsById(layoutCopy: ILayout, rowId: string): IRowIndexInfo | null {
    for (let bodyRowIndex = 0; bodyRowIndex < layoutCopy.body.rows.length; bodyRowIndex++) {
      const row = layoutCopy.body.rows[bodyRowIndex];

      if (row.id === rowId) {
        return {
          rowsPointer: layoutCopy.body.rows,
          rowIndex: bodyRowIndex,
        };
      }
    }

    return this.findEventRowArrayByRowId(layoutCopy.body.rows, rowId);
  }

}
