export type EventRowType =
  /**
   * Content in Event block Event part.
   * @See `IEventValue.eventRows`
   */
  'event' |

  /**
   * Content in Event block Ticket part, top of the Ticket.
   * @See `IEventValue.ticketTopRows`
   */
  'ticketTop' |

  /**
   * Content in Event block Ticket part, for the Ticket.
   * @See `IEventValue.ticketTicketRows`
   */
  'ticket' |

  /**
   * Content in Event block Ticket part, bottom of the Ticket.
   * @See `IEventValue.ticketBottomRows`
   */
  'ticketBottom';
