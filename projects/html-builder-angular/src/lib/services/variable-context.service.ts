import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEventVariable, IHTMLBuilderService } from '../interfaces';
import { HTML_BUILDER_SERVICE } from '../providers/email-template-editor-service.provider';
import { VariableContextType } from '../types/variable-context.type';


@Injectable({
  providedIn: 'root',
})
export class VariableContextService {

  private globalVariableList$: Observable<IEventVariable[]>;
  private ticketVariableList$: Observable<IEventVariable[]>;
  private eventVariableList$: Observable<IEventVariable[]>;

  private readonly GLOBAL_VARIABLE_STARTS_WITH = '.';
  private readonly TICKET_VARIABLE_STARTS_WITH = '$t';
  private readonly EVENT_VARIABLE_STARTS_WITH = '$e';

  constructor(@Inject(HTML_BUILDER_SERVICE) private readonly htmlBuilderService: IHTMLBuilderService) {
    this.setupVariablesLists();
  }

  getContextVariables(variableContext: VariableContextType | null): Observable<IEventVariable[]> {
    switch (variableContext) {
      case 'global':
        return this.globalVariableList$;
      case 'ticket':
        return this.ticketVariableList$;
      case 'event':
        return this.eventVariableList$;
      default:
        return this.globalVariableList$;
    }
  }

  private setupVariablesLists() {
    const variableList$ = this.htmlBuilderService.getEventVariables();

    this.globalVariableList$ = variableList$.pipe(map(list => this.filterGlobalVariables(list)));
    this.ticketVariableList$ = variableList$.pipe(map(list => this.filterTicketVariables(list)));
    this.eventVariableList$ = variableList$.pipe(map(list => this.filterEventVariables(list)));
  }

  private filterGlobalVariables(list: IEventVariable[]): IEventVariable[] {
    return list.filter(i => i.value.startsWith(this.GLOBAL_VARIABLE_STARTS_WITH));
  }

  private filterTicketVariables(list: IEventVariable[]): IEventVariable[] {
    return list.filter(i => i.value.startsWith(this.TICKET_VARIABLE_STARTS_WITH));
  }

  private filterEventVariables(list: IEventVariable[]): IEventVariable[] {
    return list.filter(i => i.value.startsWith(this.EVENT_VARIABLE_STARTS_WITH));
  }

}
