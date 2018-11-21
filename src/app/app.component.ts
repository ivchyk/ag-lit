import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockDataService  } from './services/mock-data.service';
import { GridApi } from 'ag-grid-community/src/ts/gridApi';
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

  public rowData: any[] = [];
  public columnDefs: any[] = [];
  public autoGroupColumnDef: any = undefined;
  public subscription: Subscription[] = [];
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public agTableData: BehaviorSubject<TableGridModel>;
  public rows: BehaviorSubject<number> = undefined;
  public columns: BehaviorSubject<number> = undefined;
  public columnsCount: number = 300;
  public rowsCount: number = 5000;

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
      .subscribe((data: {columns: any[], cells: any[], columnGroup: any}) => {

        const tableData: TableGridModel = new TableGridModel();
       // tableData.columnGroup = data.columnGroup;
        tableData.rowData = data.cells;
        tableData.columns = data.columns;
        // tableData.options = {
        //    groupUseEntireRow: true,
        //   enableSorting: true,
        //   enableRangeSelection: true,
        //   enableColResize: true,
        //   showFitToSizeButton: true,
        //   headerHeight: 42,
        //   wrapperHeight: '94vh'
        // };
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
