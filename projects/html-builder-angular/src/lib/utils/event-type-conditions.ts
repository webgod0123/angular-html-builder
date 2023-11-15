import { EventType, IEventTypeCondition } from '../enums/event-type.enum';

export const eventTypeConditions: IEventTypeCondition = {
  [EventType.Normal]: 'eq .event.isOnlineEvent false',
  [EventType.Livestream]: 'and (eq .event.isOnlineEvent true eq) (.event.onlineEventType "Livestream")',
  [EventType.Video]: 'and (eq .event.isOnlineEvent true) (eq .event.onlineEventType "Video")',
  [EventType.LivestreamVideo]: 'and (eq .event.isOnlineEvent true) (eq .event.onlineEventType "LivestreamVideo")',
  [EventType.Cards]: 'and (ne .giftCardDownloadLinks nil) (gt len .giftCardDownloadLinks 0)',
};
