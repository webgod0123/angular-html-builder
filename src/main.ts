import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { appConfig, APP_CONFIG } from './config/app-config';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([{ provide: APP_CONFIG, useValue: appConfig }])
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
