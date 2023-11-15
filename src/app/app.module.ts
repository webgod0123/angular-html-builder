import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule, HTTP_MODULE_CONFIG, IHttpModuleConfig, TranslateModule, TranslateService } from '@interticket/core';
import { EDITOR_CONFIG_ACCESSOR, HtmlBuilderModule, PARTNER_ID_ACCESSOR } from '../../projects/html-builder-angular/src/public-api';
import { APP_CONFIG, IAppConfig } from '../config/app-config';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HtmlBuilderModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule.forRoot(),
    TranslateModule.forRoot({}),
  ],
  providers: [
    {
      provide: HTTP_MODULE_CONFIG,
      useFactory: (config: IAppConfig): IHttpModuleConfig => ({ serviceUrl: config.serviceUrl }),
      deps: [APP_CONFIG],
    },
    {
      provide: APP_INITIALIZER,
      useFactory(translateService: TranslateService, config: IAppConfig) {
        return async () => {
          await translateService.init({
            language: config.languageConfig,
            translationTags: config.translationTags,
          });
        };
      },
      deps: [TranslateService, APP_CONFIG],
      multi: true,
    },
    {
      provide: PARTNER_ID_ACCESSOR,
      useFactory() {
        return '864f8005-6d3f-4424-8ed9-8f941d20edb7';
      },
    },
    {
      provide: EDITOR_CONFIG_ACCESSOR,
      useFactory() {
        return {
          cdnBaseUrl: 'http://placekitten.com',
        };
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
