import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import {
  TableGridModel,
  TableGridDataRow,
  TableColumn,
  TableAgregationFactor,
  TableCoumnGroup,
  TableRowClassRules,
  TableAgreagtionCallback
} from '../shared.module';
import { GridInterface} from './grid.interface';

import * as _ from 'lodash';
import { RowNode } from 'ag-grid-community/src/ts/entities/rowNode';
import { GridApi } from 'ag-grid-community/src/ts/gridApi';
import { ColumnApi } from 'ag-grid-community/src/ts/columnController/columnApi';
import { ColumnState } from 'ag-grid-community/src/ts/columnController/columnController';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-table-grid',
  template: `
        <div #tableWrapper style="height: 92vh">
            <ag-grid-angular
                style="width: 100%; height: 92vh"
                #agGrid
                [rowData]="rowData"
                class="ag-theme-balham-dark"
                [columnDefs]="columnDefs"
                [groupUseEntireRow]="groupUseEntireRow"
                [enableSorting]="true"
                [animateRows]="true"
                [enableColResize]="enableColResize"
                (gridReady)="onGridReady($event)"
                (rowDataChanged)="onRowDataChanged($event)"
                [rowClassRules]="rowClassRules"
                [groupRowAggNodes]="groupRowAggNodes"
                [suppressContextMenu]="true"
                [pinnedBottomRowData]="pinnedBottomRowData"
                [pinnedTopRowData]="pinnedTopRowData"
                [headerHeight]="headerHeight"
                [groupHeaderHeight]="groupHeaderHeight"
                [enableFilter]="enableFilter"
                [floatingFilter]="suppressFloatingFilter"
                [groupMultiAutoColumn]="groupMultiAutoColumn"
                [groupSuppressAutoColumn]="groupSuppressAutoColumn"
                [rememberGroupStateWhenNewData]="true"
                [rowGroupPanelShow]="'always'"
                [getRowNodeId]="getRowNodeId"
                [sideBar]="sideBar"
            ></ag-grid-angular>
        </div>
    `
})
export class TableGridComponent implements OnInit, OnDestroy, GridInterface {

  @ViewChild('tableWrapper') public tableWrapper: ElementRef;
  public wrapperHeight: string = '63vh';

  @Input() set clTableData(data: TableGridModel) {
    this.agTableData.next(data);
  }

  public rowData: TableGridDataRow[];
  public columnDefs: TableColumn[];
  public autoGroupColumnDef: TableCoumnGroup;
  public groupRowAggNodes: TableAgreagtionCallback;
  public rowClassRules: TableRowClassRules;
  public groupUseEntireRow: boolean = false;
  public enableSorting: boolean = true;
  public enableColResize: boolean = true;
  public enableRangeSelection: boolean = true;
  public showExpandButton: boolean = true;
  public fullScreenMode: boolean = false;
  public showFitToSizeButton: boolean = true;
  public groupMultiAutoColumn: boolean = false;
  public pinnedBottomRowData: TableGridDataRow[] = [];
  public pinnedTopRowData: TableGridDataRow[] = [];
  public headerHeight: number | undefined;
  public groupHeaderHeight: number | undefined;
  public enableFilter: boolean = false;
  public suppressFloatingFilter: boolean = false;
  public groupSuppressAutoColumn: boolean = false;
  public getRowNodeId: any;
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public readonly sideBar = {
    toolPanels: [{
      id: 'columns',
      labelDefault: 'Columns',
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel',
      toolPanelParams: {
        suppressPivotMode: true
      }
    }]
  }
  public columnState: ColumnState[];
  private agregationSnapshot: TableAgregationFactor;
  private reducedColumns: string[] = [];
  private agTableData: BehaviorSubject<TableGridModel>;
  private subscriptions: {[key: string]: Subscription}  = {};
  private rowsExpanded: boolean = true;
  private agregation: TableAgreagtionCallback;

  constructor (private renderService: Renderer2) {
    this.agTableData = new BehaviorSubject(undefined);
  }

  public onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.expandAll();
    // setTimeout(() => this.gridApi.sizeColumnsToFit(), 0);
    this.columnState = this.gridColumnApi.getColumnState();
  }

  public restoreTable(): void {
    if (this.columnState) {
      this.gridColumnApi.setColumnState(this.columnState);
      this.gridApi.expandAll();
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 0);
      this.gridApi.setFilterModel(null);
      this.gridApi.setSortModel(null);
    }
  }

  public onRowDataChanged(params: any): void {
    if (this.gridApi) {
      // this.gridApi.sizeColumnsToFit();
      this.gridApi.expandAll();
      // this.rowsExpanded = true;
    }
  }

  public ngOnInit(): void {
    this.subscriptions.agData = this.agTableData
      .subscribe(
        (tableData: TableGridModel): void => {
          if (this.columnDefs === undefined || this.columnDefs.length !== tableData.columns.length) {
            this.initData(tableData);
          } else {
            this.gridApi.updateRowData({update: tableData.rowData});
          }
        },
        (error: Error): void => {
          console.error(error);
        }
      );
  }

  public ngOnDestroy(): void {
    this.agTableData.complete();
    for (let i in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(i) === false) {
        continue;
      }
      this.subscriptions[i].unsubscribe();
    }
  }
  public expandRows(): void {
    if (!this.rowsExpanded) {
      this.gridApi.expandAll();
    } else {
      this.gridApi.collapseAll();
    }
    this.rowsExpanded = !this.rowsExpanded;
  }


  public sizeToWidth(): void {
    this.gridApi.sizeColumnsToFit();
  }

  public fullscreen(): void {

    const el: ElementRef = this.tableWrapper.nativeElement;
    if (!this.fullScreenMode) {
      this.renderService.setStyle(el, "position", "fixed");
      this.renderService.setStyle(el, "width", "100vw");
      this.renderService.setStyle(el, "top", "45px");
      this.renderService.setStyle(el, "bottom", 0);
      this.renderService.setStyle(el, "z-index", 1000);
      this.renderService.setStyle(el, "left", 0);
      this.renderService.setStyle(el, "right", 0);
      this.renderService.setStyle(el, "background-color", "white");
      this.renderService.removeStyle(el, "height");
    } else {
      this.renderService.removeStyle(el, "position");
      this.renderService.removeStyle(el, "width");
      this.renderService.removeStyle(el, "top",);
      this.renderService.removeStyle(el, "bottom", );
      this.renderService.removeStyle(el, "z-index", );
      this.renderService.removeStyle(el, "left");
      this.renderService.removeStyle(el, "right");
      this.renderService.removeStyle(el, "background-color");
      this.renderService.setStyle(el, "height", this.wrapperHeight);
    }

    this.fullScreenMode = !this.fullScreenMode;
  }

  public autoSizeAll(): void {
    const allColumnIds: any[] =
      this.gridColumnApi.getAllColumns()
        .map((column: any) => column.colId);
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  private recursiveLoop(inputObject: TableColumn): void {
    if (inputObject.children) {
      _.forEach(inputObject.children, (value: TableColumn) => {
        this.recursiveLoop(value);
      });
    } else {
      this.reducedColumns.push(inputObject.field);
    }
  }

  private exportExcel(): void {

    this.gridApi.exportDataAsExcel();
  }

  private toggleFilter(): void
  {
    this.suppressFloatingFilter = !this.suppressFloatingFilter;
    setTimeout(() => {
      this.gridApi.refreshHeader();
    }, 0);
  }

  private initData(tableData: TableGridModel): void {
    this.columnDefs = tableData.columns;
    this.autoGroupColumnDef = tableData.columnGroup;
    if (tableData.agregation !== undefined) {
      this.agregation = tableData.agregation;
    }
    if (tableData.options) {
      this.groupUseEntireRow = tableData.options.groupUseEntireRow;
      this.enableSorting = tableData.options.enableSorting;
      this.enableColResize = tableData.options.enableColResize;
      this.enableRangeSelection = tableData.options.enableRangeSelection;
      this.showExpandButton = tableData.options.showExpandButton !== undefined ? tableData.options.showExpandButton : this.showExpandButton;
      this.showFitToSizeButton = tableData.options.showFitToSizeButton !== undefined ? tableData.options.showFitToSizeButton : this.showFitToSizeButton;
      if (tableData.options.wrapperHeight !== undefined) {
        this.wrapperHeight = tableData.options.wrapperHeight;
      }
      if (tableData.options.headerHeight !== undefined) {
        this.headerHeight = tableData.options.headerHeight;
      }
      if (tableData.options.groupHeaderHeight !== undefined) {
        this.groupHeaderHeight = tableData.options.groupHeaderHeight;
      }
      if (tableData.options.enableFilter !== undefined) {
        this.enableFilter = tableData.options.enableFilter;
      }
      if (tableData.options.groupMultiAutoColumn !== undefined) {
        this.groupMultiAutoColumn = tableData.options.groupMultiAutoColumn;
      }
      if (tableData.options.groupSuppressAutoColumn !== undefined) {
        this.groupSuppressAutoColumn = tableData.options.groupSuppressAutoColumn;
      }
      if (tableData.options.getRowNodeId !== undefined) {
        this.getRowNodeId = tableData.options.getRowNodeId;
      }
    }

    for (const columnItem of  this.columnDefs) {
      if (columnItem['rowGroup'] === undefined) {
        this.recursiveLoop(columnItem);
      }
    }
    this.agregationSnapshot = {};
    for (const reducedColumnItem of  this.reducedColumns ) {
      this.agregationSnapshot[reducedColumnItem] = '';
    }
    this.rowData = tableData.rowData;
    if (tableData.rowClassRules) {
      this.rowClassRules = tableData.rowClassRules;
    }

    if  (this.agregation) {
      this.groupRowAggNodes = (nodes: RowNode[]): TableAgregationFactor => this.agregation(nodes, this.agregationSnapshot, this.autoGroupColumnDef);
    }
    if (tableData.pinnedBottomRowData) {
      this.pinnedBottomRowData = tableData.pinnedBottomRowData;
    }
    if (tableData.pinnedTopRowData) {
      this.pinnedTopRowData = tableData.pinnedTopRowData;
    }
  }
}
