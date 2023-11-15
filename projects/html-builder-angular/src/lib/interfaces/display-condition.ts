export interface IDisplayCondition {
  name: string
  event_count: string
  ticket_count: string
}

export interface ITestEmailSend {
  displayConditions: IDisplayCondition[],
  language?: string
  to: string
}

export interface IPreviewTemplateSend {
  displayConditions: IDisplayCondition[]
}
