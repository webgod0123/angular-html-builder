export enum EventType {
  Normal = 'normal',
  Livestream = 'livestream',
  Video = 'video',
  LivestreamVideo = 'livestreamvideo',
  Cards = 'cards'
}

export enum DisplayCondition {
  IfStart = '{{if ',
  IfEnd = ' }}',
  OrStart = 'or ',
  OrInnerStart = '(',
  OrEnd = ')',
  EndOfCondition = '{{end}}',
}

export type IEventTypeCondition = {
  [key in EventType]: string;
};

export enum EventColumnType {
  Type1 = 'type1',
  Type2 = 'type2',
  Type3 = 'type3',
  Type4 = 'type4',
}
