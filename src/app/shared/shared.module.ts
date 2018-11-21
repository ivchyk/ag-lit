import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import 'ag-grid-enterprise';
import { AgGridModule } from 'ag-grid-angular';

import {
  TableAgreagtionCallback,
  TableAgregationFactor,
  TableColumn,
  TableCoumnGroup,
  TableGridData,
  TableGridDataRow,
  TableGridModel,
  TableOptions,
  TableRowClassRules,
} from './table/table-grid.model';
import { TableGridComponent } from './table/table-grid.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents([])
  ],
  declarations: [
    TableGridComponent,
  ],
  exports: [
    TableGridComponent
  ]
})
export class SharedModule { }

export {
  TableAgreagtionCallback,
  TableAgregationFactor,
  TableColumn,
  TableCoumnGroup,
  TableGridData,
  TableGridDataRow,
  TableGridModel,
  TableOptions,
  TableRowClassRules,
};
