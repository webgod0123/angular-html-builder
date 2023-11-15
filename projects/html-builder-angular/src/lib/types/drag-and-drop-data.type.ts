import { EventColumnType } from '../enums/event-type.enum';
import { IEventVariable, IRowCols } from '../interfaces';

export type IImageVariable = string;

export type DragAndDropData = IRowCols | IEventVariable | IImageVariable | EventColumnType;
