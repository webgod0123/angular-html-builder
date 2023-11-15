import { Injectable } from '@angular/core';
import { ILayout } from '../layout-schema/layout-schema.interface';
import { LayoutStateService } from './layout-state.service';

@Injectable()
export class LayoutUndoRedoService {

  /**
   * Contains all previous versions.
   * The last element is always the current state.
   */
  private undoQueue: ILayout[] = [];

  /**
   * Contains all possible future versions, after one or more undo actions.
   */
  private redoQueue: ILayout[] = [];

  constructor(private layoutStateService: LayoutStateService) {
  }

  emptyQueues() {
    this.emptyUndoQueue();
    this.emptyRedoQueue();
  }

  addToUndoQueue(json: ILayout): void {
    this.undoQueue.push(json);
  }

  addToRedoQueue(json: ILayout): void {
    this.redoQueue.push(json);
  }

  emptyRedoQueue(): void {
    this.redoQueue = [];
  }

  undoState(): void {
    if (!this.isUndoPossible()) {
      return;
    }

    const currentState = this.undoQueue.pop() as ILayout;
    this.addToRedoQueue(currentState);
    const previousState = this.undoQueue[this.undoQueue.length - 1];

    this.layoutStateService.addNewLayoutVersion(previousState);
  }

  redoState(): void {
    if (!this.isRedoPossible()) {
      return;
    }

    const nextState = this.redoQueue.pop() as ILayout;
    this.addToUndoQueue(nextState);

    this.layoutStateService.addNewLayoutVersion(nextState);
  }

  isUndoPossible(): boolean {
    return this.undoQueue.length > 1;
  }

  isRedoPossible(): boolean {
    return this.redoQueue.length > 0;
  }

  private emptyUndoQueue(): void {
    this.undoQueue = [];
  }

}
