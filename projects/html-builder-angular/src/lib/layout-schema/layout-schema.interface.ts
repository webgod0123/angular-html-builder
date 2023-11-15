import { BackgroundPosition } from '../enums/background-position.enum';
import { ContentComponentType } from '../enums/content-components.enums';
import { DateFormat } from '../enums/date-format.enum';
import { EventColumnType, EventType } from '../enums/event-type.enum';
import { HeadingType } from '../enums/heading-type.enums';
import { SiteAction } from '../enums/site-action.enum';

export type UserEditableBlocks = IBody | IRow | IColumn | IContent;

export type BackgroundRepeat = 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';

export interface ILayout {
  body: IBody;
}

export interface IBody {
  id: string;
  type: ContentComponentType.BODY;
  rows: IRow[];
  values: IBodyValues;
}

export interface IRow {
  id: string;
  type: ContentComponentType.BLOCK;
  columns: IColumn[];
  values: IRowValues;
}

export interface IColumn {
  id: string;
  type: ContentComponentType.COLUMN;
  width: number;
  contents: IContent[];
  values: IColumnValues;
}

export type CustomValues = ITextValue | IVariableValue | IImageValue | IMenuValue | IButtonValue | IHtmlValue | IHeadValue | IDividerValues | IEventValue;

export interface IContent extends ITypedContent<CustomValues> { }

export interface ITypedContent<T> {
  id: string;
  type: ContentComponentType;
  values: T;
}

interface ICommon {
  locked: boolean;
}

export interface IColumnValues extends ISpacing, IBorder {
  backgroundColor?: string;
}

export interface ITextValue extends ISpacing, IDisplayConditions, ITextFormatting, ICommon {

  /**
   * The actual string to render
   */
  text: string;

  inheritBodyStyles?: boolean;

  linkColor?: string;

  underline?: boolean;

  containerPadding: ISpacing;
}

export interface IVariableValue extends ISpacing, IDisplayConditions, ITextFormatting, ICommon {

  /**
   * The string to render
   */
  value: string;

  isDate?: boolean;

  /**
   * Date format if the variable is date type
   */
  dateFormat?: DateFormat;
}

export interface IHeadValue extends ISpacing, IDisplayConditions, ITextFormatting, ICommon {

  /**
   * The actual string to render
   */
  text: string;

  inheritBodyStyles?: boolean;

  linkColor?: string;

  underline?: boolean;

  containerPadding: ISpacing;

  headingType: HeadingType;
}

export interface IImageValue extends ISpacing, ITextFormatting, IDisplayConditions, ICommon {
  action?: SiteAction;

  src: string;

  autoWidth?: boolean;

  altText?: string;

  // TODO: refactor to number
  width?: string;

  href?: string;

  target?: string;

  emailTo?: string;

  subject?: string;

  body?: string;

  phone?: string;
}

export interface IButtonValue extends ISpacing, ITextFormatting, IDisplayConditions, IBorder, ICommon {
  href?: string;

  target?: string;

  emailTo?: string;

  subject?: string;

  body?: string;

  phone?: string;

  variable?: string;
  // TODO: refactor to number
  width?: string;

  autoWidth?: boolean;

  text: string;

  backgroundColor?: string;

  action?: SiteAction;

  containerPadding: ISpacing;
}

export interface IMenuItem {
  id: string;
  text: string;
  name?: string
  href?: string;
  target?: '_self' | '_blank';
  actionType?: SiteAction
  emailTo?: string
  subject?: string
  body?: string
  phone?: string
}

export interface IMenuValue extends ISpacing, IDisplayConditions, ITextFormatting, ICommon {
  menuItems: IMenuItem[];
  linkColor: string;
  layout: MenuLayout;
  separator: string;
  containerPadding: ISpacing;
}

export type MenuLayout = 'horizontal' | 'vertical';

export interface IDividerValues extends IDisplayConditions, IBorder, ISpacing, ICommon {

  /**
   * Width in percentage.
   */
  width: number;

  textAlign: TextAlign;
}

export interface IEventValue extends ISpacing, IDisplayConditions, ICommon {

  eventColumnType: EventColumnType;

  textColor: string;

  lineHeight: number;

  textAlign: TextAlign;

  inheritBodyStyles?: boolean;

  linkColor?: string;

  eventRows: IRow[];

  ticketTopRows: IRow[];

  ticketTicketRows: IRow[];

  ticketBottomRows: IRow[];
}


export interface IBodyValues {
  /**
   * Example value: "600"
   */
  contentWidth: number;

  /**
   * Example value: "#000000"
   */
  textColor: string;

  /**
   * Example value: "#000000"
   */
  backgroundColor: string;

  contentAlignment: 'left' | 'center';

  fontFamily: string;

  linkColor: string;

  underline: boolean;
}

export interface IRowValues extends ISpacing, IDisplayConditions, ICommon {
  backgroundColor?: string;
  contentBackgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundRepeat?: BackgroundRepeat;
  backgroundPosition?: BackgroundPosition,
}

export interface ISpacing {

  /**
   * Example value: 10
   */
  paddingTop?: number;

  paddingRight?: number;

  paddingBottom?: number;

  paddingLeft?: number;
}

type BorderStyle = 'solid' | 'dashed' | 'dotted';

export interface IBorder {
  borderTopStyle?: BorderStyle;

  borderLeftStyle?: BorderStyle;

  borderRightStyle?: BorderStyle;

  borderBottomStyle?: BorderStyle;

  borderTopColor?: string;

  borderLeftColor?: string;

  borderRightColor?: string;

  borderBottomColor?: string;

  borderTopWidth?: number;

  borderLeftWidth?: number;

  borderRightWidth?: number;

  borderBottomWidth?: number;

  borderTopLeftRadius?: number;

  borderTopRightRadius?: number;

  borderBottomLeftRadius?: number;

  borderBottomRightRadius?: number;

  borderAll?: boolean;
}


interface IDisplayConditions {
  /**
   * Display only for the EventType-s listed here
   */
  displayConditions?: EventType[];
}

type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface ITextFormatting {

  /**
   * Example value: 15
   */
  fontSize?: number;

  textAlign: TextAlign;

  /**
   * Example value: 140
   */
  lineHeight?: number;

  /**
   * Example value: "#000000"
   */
  textColor?: string;

  fontFamily?: string;

  fontWeight?: string;
}

export interface IBorderRadius {

  /**
   * Example value: 10
   */
  topLeft?: number;

  topRight?: number;

  bottomLeft?: number;

  bottomRight?: number;
}

export interface IHtmlValue extends ISpacing, IDisplayConditions, ICommon {

  /**
   * The actual string to render
   */
  htmlContent: string;

  containerPadding: ISpacing;
}

export interface ILanguageLayout {
  id: string,
  language: string,
}

export interface IRowIndexInfo {
  rowsPointer: IRow[];
  rowIndex: number;
}
