import { Injectable } from '@angular/core';
import { ContentComponentType } from '../enums';
import { HeadingType, HeadingTypeFontSize } from '../enums/heading-type.enums';
import { SiteAction } from '../enums/site-action.enum';
import { IEventVariable } from '../interfaces';
import {
  CustomValues,
  IButtonValue,
  IDividerValues,
  IEventValue,
  IHeadValue,
  IHtmlValue,
  IImageValue,
  ILayout,
  IMenuValue,
  ITextValue,
  IVariableValue,
} from '../layout-schema/layout-schema.interface';
import { DragAndDropData, IImageVariable } from '../types/drag-and-drop-data.type';
import { uuidv4 } from '../utils/uuid';
import { EventColumnType } from '../enums/event-type.enum';

@Injectable()
export class InitialValuesService {

  readonly DEFAULT_CONTENT_WIDTH = 600;
  readonly DEFAULT_CONTENT_ALIGNMENT = 'center';
  readonly DEFAULT_BACKGROUND = '#ffffff';
  readonly DEFAULT_TEXT_COLOR = '#000000';
  readonly DEFAULT_BORDER_COLOR = '#000000';
  readonly DEFAULT_LINK_COLOR = '#3aaee0';
  readonly DEFAULT_TEXT_ALIGN = 'left';
  readonly DEFAULT_FONT_SIZE = 14;
  readonly DEFAULT_LINE_HEIGHT = 140;
  readonly DEFAULT_PADDING = 10;
  readonly DEFAULT_BORDER_RADIUS = 10;
  readonly DEFAULT_FONT_FAMILY = 'Arial';
  readonly DEFAULT_FONT_WEIGHT = 'Regular';
  readonly DEFAULT_MENU_LAYOUT = 'horizontal';
  readonly DEFAULT_BACKGROUND_REPEAT = 'no-repeat';
  readonly DEFAULT_BORDER_STYLE = 'solid';
  readonly DEFAULT_BORDER_WIDTH = 1;

  readonly INITIAL_LAYOUT: ILayout = {
    body: {
      id: uuidv4(),
      type: ContentComponentType.BODY,
      rows: [],
      values: {
        contentWidth: this.DEFAULT_CONTENT_WIDTH,
        contentAlignment: this.DEFAULT_CONTENT_ALIGNMENT,
        textColor: this.DEFAULT_TEXT_COLOR,
        backgroundColor: this.DEFAULT_BACKGROUND,
        fontFamily: this.DEFAULT_FONT_FAMILY,
        underline: false,
        linkColor: this.DEFAULT_LINK_COLOR,
      },
    },
  };

  createInitialValuesForContentType(componentType: ContentComponentType, dndData: DragAndDropData): CustomValues | undefined {
    switch (componentType) {
      case ContentComponentType.TEXT: {
        return this.createTextInitialValues();
      }
      case ContentComponentType.HEAD: {
        return this.createHeadInitialValues();
      }
      case ContentComponentType.VARIABLE: {
        return this.createVariableInitialValues(dndData);
      }
      case ContentComponentType.IMAGE: {
        return this.createImageInitialValues(dndData);
      }
      case ContentComponentType.MENU: {
        return this.createMenuInitialValues();
      }
      case ContentComponentType.BUTTON: {
        return this.createButtonInitialValues();
      }
      case ContentComponentType.HTML: {
        return this.createHtmlInitialValues();
      }
      case ContentComponentType.DIVIDER: {
        return this.createDividerInitialValues();
      }
      case ContentComponentType.EVENT: {
        return this.createEventInitialValues(dndData);
      }
      default:
        // Content type not yet supported.
        return;
    }
  }

  private createTextInitialValues(): ITextValue {
    return {
      text: '<p>This is a new Text block. Change the text.</p>',
      fontSize: this.DEFAULT_FONT_SIZE,
      lineHeight: this.DEFAULT_LINE_HEIGHT,
      textAlign: this.DEFAULT_TEXT_ALIGN,
      textColor: this.DEFAULT_TEXT_COLOR,
      fontWeight: this.DEFAULT_FONT_WEIGHT,
      fontFamily: this.DEFAULT_FONT_FAMILY,
      inheritBodyStyles: true,
      linkColor: this.DEFAULT_LINK_COLOR,
      underline: false,
      containerPadding: {
        paddingBottom: this.DEFAULT_PADDING,
        paddingTop: this.DEFAULT_PADDING,
        paddingLeft: this.DEFAULT_PADDING,
        paddingRight: this.DEFAULT_PADDING,
      },
      locked: false,
    };
  }

  private createHeadInitialValues(): IHeadValue {
    return {
      text: '<p>Heading</p>',
      headingType: HeadingType.H1,
      fontSize: HeadingTypeFontSize[HeadingType.H1],
      lineHeight: this.DEFAULT_LINE_HEIGHT,
      textAlign: this.DEFAULT_TEXT_ALIGN,
      textColor: this.DEFAULT_TEXT_COLOR,
      fontWeight: this.DEFAULT_FONT_WEIGHT,
      fontFamily: this.DEFAULT_FONT_FAMILY,
      inheritBodyStyles: true,
      linkColor: this.DEFAULT_LINK_COLOR,
      underline: false,
      containerPadding: {
        paddingBottom: this.DEFAULT_PADDING,
        paddingTop: this.DEFAULT_PADDING,
        paddingLeft: this.DEFAULT_PADDING,
        paddingRight: this.DEFAULT_PADDING,
      },
      locked: false,
    };
  }

  private createVariableInitialValues(dndData: DragAndDropData): IVariableValue {
    const data: IEventVariable = dndData as IEventVariable;

    return {
      value: data.value,
      textAlign: this.DEFAULT_TEXT_ALIGN,
      textColor: this.DEFAULT_TEXT_COLOR,
      lineHeight: this.DEFAULT_LINE_HEIGHT,
      fontSize: this.DEFAULT_FONT_SIZE,
      locked: false,
    };
  }

  private createImageInitialValues(dndData: DragAndDropData): IImageValue {
    const src: IImageVariable = dndData as IImageVariable;

    return {
      textAlign: this.DEFAULT_TEXT_ALIGN,
      src: src,
      paddingBottom: this.DEFAULT_PADDING,
      paddingTop: this.DEFAULT_PADDING,
      paddingLeft: this.DEFAULT_PADDING,
      paddingRight: this.DEFAULT_PADDING,
      autoWidth: true,
      width: '100',
      altText: '',
      action: SiteAction.WEBSITE,
      locked: false,
    };
  }

  private createMenuInitialValues(): IMenuValue {
    return {
      menuItems: [
        {
          id: uuidv4(),
          text: 'Menu',
          name: '',
          href: '',
          target: '_self',
          actionType: SiteAction.WEBSITE,
        },
      ],
      textAlign: this.DEFAULT_TEXT_ALIGN,
      fontFamily: 'Arial',
      fontWeight: 'Regular',
      layout: 'horizontal',
      separator: '',
      fontSize: this.DEFAULT_FONT_SIZE,
      lineHeight: this.DEFAULT_LINE_HEIGHT,
      textColor: this.DEFAULT_TEXT_COLOR,
      linkColor: this.DEFAULT_TEXT_COLOR,
      paddingBottom: this.DEFAULT_PADDING,
      paddingTop: this.DEFAULT_PADDING,
      paddingLeft: this.DEFAULT_PADDING,
      paddingRight: this.DEFAULT_PADDING,
      containerPadding: {
        paddingBottom: this.DEFAULT_PADDING,
        paddingTop: this.DEFAULT_PADDING,
        paddingLeft: this.DEFAULT_PADDING,
        paddingRight: this.DEFAULT_PADDING,
      },
      locked: false,
    };
  }

  private createButtonInitialValues(): IButtonValue {
    return {
      text: '<p>Button Text</p>',
      paddingBottom: this.DEFAULT_PADDING,
      paddingTop: this.DEFAULT_PADDING,
      paddingLeft: this.DEFAULT_PADDING,
      paddingRight: this.DEFAULT_PADDING,
      borderTopLeftRadius: this.DEFAULT_BORDER_RADIUS,
      borderTopRightRadius: this.DEFAULT_BORDER_RADIUS,
      borderBottomLeftRadius: this.DEFAULT_BORDER_RADIUS,
      borderBottomRightRadius: this.DEFAULT_BORDER_RADIUS,
      autoWidth: true,
      width: '100',
      textAlign: 'center',
      textColor: 'rgb(255,255,255)',
      fontSize: this.DEFAULT_FONT_SIZE,
      backgroundColor: '#3AAEE0',
      action: SiteAction.WEBSITE,
      target: '_blank',
      lineHeight: this.DEFAULT_LINE_HEIGHT,
      fontWeight: 'Regular',
      fontFamily: 'Arial',
      containerPadding: {
        paddingBottom: this.DEFAULT_PADDING,
        paddingTop: this.DEFAULT_PADDING,
        paddingLeft: this.DEFAULT_PADDING,
        paddingRight: this.DEFAULT_PADDING,
      },
      borderAll: false,
      locked: false,
    };
  }

  private createHtmlInitialValues(): IHtmlValue {
    return {
      htmlContent: '<div>Sample Html</div>',
      containerPadding: {
        paddingBottom: this.DEFAULT_PADDING,
        paddingTop: this.DEFAULT_PADDING,
        paddingLeft: this.DEFAULT_PADDING,
        paddingRight: this.DEFAULT_PADDING,
      },
      locked: false,
    };
  }

  private createDividerInitialValues(): IDividerValues {
    return {
      paddingBottom: this.DEFAULT_PADDING,
      paddingTop: this.DEFAULT_PADDING,
      paddingLeft: this.DEFAULT_PADDING,
      paddingRight: this.DEFAULT_PADDING,
      textAlign: this.DEFAULT_TEXT_ALIGN,
      width: 100,
      locked: false,
      borderTopStyle: this.DEFAULT_BORDER_STYLE,
      borderTopWidth: this.DEFAULT_BORDER_WIDTH,
      borderTopColor: this.DEFAULT_BORDER_COLOR,
    };
  }

  createEventInitialValues(dndData: DragAndDropData): IEventValue {
    const eventColumnType = dndData as EventColumnType;

    return {
      eventColumnType: eventColumnType,
      textColor: this.DEFAULT_TEXT_COLOR,
      lineHeight: this.DEFAULT_LINE_HEIGHT,
      textAlign: this.DEFAULT_TEXT_ALIGN,
      paddingBottom: 0,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      locked: false,
      eventRows: [],
      ticketTopRows: [],
      ticketTicketRows: [],
      ticketBottomRows: [],
    };
  }

}
