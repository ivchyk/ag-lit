import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FooBarService  } from './services/foo-bar.service'
import { MockDataService  } from './services/mock-data.service'

import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([])
  ],
  providers: [FooBarService, MockDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
