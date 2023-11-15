import { Component, Input } from '@angular/core';
import { ContentComponentType } from '../../../enums';
import {
  IButtonValue,
  IContent,
  IDividerValues,
  IEventValue,
  IHeadValue,
  IHtmlValue,
  IImageValue,
  IMenuValue,
  ITextValue,
  IVariableValue,
} from '../../layout-schema.interface';

@Component({
  template: '',
})
export abstract class BaseContentRendererComponent {

  readonly ContentComponentType = ContentComponentType;

  @Input() layoutJson: IContent;

  get textValues(): ITextValue {
    return <ITextValue> this.layoutJson.values;
  }

  get variablesValues(): IVariableValue {
    return <IVariableValue> this.layoutJson.values;
  }

  get menuValues(): IMenuValue {
    return <IMenuValue> this.layoutJson.values;
  }

  get imageValues(): IImageValue {
    return <IImageValue> this.layoutJson.values;
  }

  get buttonValues(): IButtonValue {
    return <IButtonValue> this.layoutJson.values;
  }

  get headValues(): IHeadValue {
    return <IHeadValue> this.layoutJson.values;
  }

  get dividerValues(): IDividerValues {
    return <IDividerValues> this.layoutJson.values;
  }

  get eventValues(): IEventValue {
    return <IEventValue> this.layoutJson.values;
  }

  get htmlValues(): IHtmlValue {
    return <IHtmlValue> this.layoutJson.values;
  }

}
