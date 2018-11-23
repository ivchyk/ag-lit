import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockDataService  } from './services/mock-data.service';
import { RowNode } from 'ag-grid-community/src/ts/entities/rowNode';
import { ColumnApi } from 'ag-grid-community/src/ts/columnController/columnApi';
import { BehaviorSubject, zip } from 'rxjs';
import {
  TableAgreagtionCallback,
  TableAgregationFactor,
  TableColumn,
  TableCoumnGroup,
  TableGridDataRow,
  TableGridModel,
  TableOptions,
} from './shared/shared.module';
import { NgForm } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public subscription: Subscription[] = [];
  public agTableData: BehaviorSubject<TableGridModel>;
  public rows: BehaviorSubject<number> = undefined;
  public columns: BehaviorSubject<number> = undefined;

  constructor (private mockDataService: MockDataService) {
    this.agTableData = new BehaviorSubject(undefined);
    this.rows = new BehaviorSubject<number>(5000);
    this.columns = new BehaviorSubject<number>(300);
  }
  ngOnInit() {
    this.subscription['grid'] = zip(this.rows, this.columns)
      .pipe(
        switchMap((data: any[]) => this.mockDataService.getData(data[0], data[1]))
      )
      // .subscribe((data: any) => console.log(data));
    // this.subscription['mock_data'] = this.mockDataService.getData(this.rowsCount, this.columnsCount)
      .subscribe((data: {columns: any[], cells: any[], columnGroup: any, columnValueRank: any}) => {

        const tableData: TableGridModel = new TableGridModel();
        tableData.rowData = data.cells;
        tableData.columns = data.columns;
        tableData.options = {
          getRowNodeId: (rowObject: any) => rowObject.litmusId,
          groupUseEntireRow: false,
          enableSorting: true,
          enableRangeSelection: true,
          enableColResize: true,
        };
        const total_weight: number = data.cells.reduce((accumulator: number, current: any) => {
          accumulator += current.weight;
          return accumulator;
        }, 0);

        const agregation: TableAgreagtionCallback = (nodes: RowNode[], agregationSnapshot: TableAgregationFactor, autoGroupColumnDef: TableCoumnGroup): TableAgregationFactor => {
          const result: TableAgregationFactor = {};
          for (const snapshotKey of Object.keys(agregationSnapshot)) {
            result[snapshotKey] = 0;
          }
            const nodeLength: number = nodes.length;
          const ctr_count: number = 0;
          for (let i: number = 0; i < nodeLength; i++) {
            const node: RowNode = nodes[i];
            const  data: any = node.group ? node.aggData : node.data;
            if (data !== undefined ) {
              for (const column in result) {
                if (result[column] !== undefined && data !== undefined &&
                  data[column] !== undefined  && typeof data[column] === 'number') {
                  if (column === 'weight') {
                    if (node.group === false) {
                      result[column] += data[column] / total_weight * 100;
                    } else {
                      result[column] += data[column];
                    }
                  } else {
                    result[column] += data[column];
                  }
                }
              }
            }
          }

          if (ctr_count > 0) {
            result['ctr'] /= ctr_count;
          }

          return result;
        };
        tableData.agregation = agregation;
        this.agTableData.next(tableData);
      });
  }

  ngOnDestroy() {
    for (const i in this.subscription) {
      this.subscription[i].unsubscribe();
    }
  }

  onSubmit($event: NgForm) {
    const controls = $event.form.controls;
    const columns = controls.cols.value;
    const rows = controls.rows.value;
    this.columns.next(columns);
    this.rows.next(rows);
  }
}
