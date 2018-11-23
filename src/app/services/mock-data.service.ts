/**
 * Created by vova on 20.11.18.
 */
import { interval, Observable, of, Subscription } from 'rxjs';
import { sample, take, map, mergeMap, timestamp } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class MockDataService {
  private columns: any[] = [];
  private cells: any[] = [];
  private columnGroup: any = {};
  private readonly portfolio: string[] = [
    'Dell Latitude', 'Dell XPS', 'Dell Inspiron', 'Lenovo Legion', 'Lenovo ThinkPad', 'Acer Aspire', 'HP Pavillion'
  ];
  private readonly marketCap: string[] = ['Unknown', 'Micro', 'Small', 'Mid', 'Large', 'Mega'];
  private readonly direction: string[] = ['Long', 'Short'];
  private readonly giscSector: string[] = ['Consumer Discretionary', 'Consumer Staples', 'Currency Hedge', 'Financials', 'Health Care',
                                           'Industrials', 'Information Technology', 'Market Hedge', 'Materials', 'Real Estate', 'Telecomunication Services'];
  private cellsSnapshot: any[] = [];
  private columnValueRank: any = {
    'pnl': {
      20: 'cell-style2',
      40: 'cell-style3',
      60: 'cell-style4',
      80: 'cell-style5',
      100: 'cell-style6',
    },
    'weight': {
      10: 'cell-style2',
      20: 'cell-style3',
      30: 'cell-style4',
      40: 'cell-style5',
      50: 'cell-style2',
    },
    'ctr': {
      2000: 'cell-style2',
      4000: 'cell-style3',
      6000: 'cell-style4',
      8000: 'cell-style5',
      10000: 'cell-style6',
    }
  }

  constructor() {}

  private initData(rows: number, columns: number): void {
    this.columns = [
      {field: 'direction', headerName: 'Direction', width: 70, rowGroup: true, enableRowGroup: true, columnGroupShow: false, hide: true},
      {field: 'market_cap', headerName: 'Market Cap', width: 75, rowGroup: true, enableRowGroup: true, columnGroupShow: false, hide: true},
      {field: 'gisc_sector', headerName: 'Gisc Sector', width: 90, rowGroup: true, enableRowGroup: true, columnGroupShow: false, hide: true},
      {field: 'portfolio', headerName: 'Portfolio', width: 300, rowGroup: true, enableRowGroup: true, columnGroupShow: false, hide: true},
      {field: 'pnl', headerName: 'P&L', width: 75, cellRenderer: 'agAnimateShowChangeCellRenderer', cellClass:  (params: any): string => this.takeClasses(params) },
      {field: 'weight', headerName: 'Weight', width: 75, cellRenderer: 'agAnimateShowChangeCellRenderer', cellClass: (params: any): string => this.takeClasses(params)},
      {field: 'ctr', headerName: 'CTR', width: 75, cellRenderer: 'agAnimateShowChangeCellRenderer', cellClass: (params: any): string => this.takeClasses(params)},
      {field: 'litmusId', headerName: '', hide: true}
    ];

    this.cells = [];
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      if (this.cells[rowIndex] === undefined) {
        if (this.cellsSnapshot.length > 0 && this.cellsSnapshot[rowIndex] !== undefined) {
          this.cells[rowIndex] = {};
          this.cells[rowIndex].direction = this.cellsSnapshot[rowIndex].direction;
          this.cells[rowIndex].market_cap = this.cellsSnapshot[rowIndex].market_cap;
          this.cells[rowIndex].gisc_sector = this.cellsSnapshot[rowIndex].gisc_sector;
          this.cells[rowIndex].portfolio = this.cellsSnapshot[rowIndex].portfolio;
          this.cells[rowIndex].pnl = Math.floor(Math.random() * 100);
          this.cells[rowIndex].weight =  Math.floor(Math.random() * 50);
        } else {
          this.cells[rowIndex] = {
            'direction': MockDataService.takeDirection(this.direction),
            'market_cap': MockDataService.takeDirection(this.marketCap),
            'gisc_sector': MockDataService.takeDirection(this.giscSector),
            'portfolio': MockDataService.takeDirection(this.portfolio),
            'pnl': Math.floor(Math.random() * 100),
            'weight': Math.floor(Math.random() * 50),
          };
        }
        this.cells[rowIndex].litmusId = rowIndex + 1;
        this.cells[rowIndex].ctr = this.cells[rowIndex].pnl * this.cells[rowIndex].weight;
      }
      for (let colIndex = 6; colIndex < columns; colIndex++) {
        if (rowIndex === 0) {
            const col = {field: 'Col' + colIndex, headerName: 'Column ' + (1 + colIndex), width: 80,
            cellRenderer: 'agAnimateShowChangeCellRenderer',
            cellClass: (params: any): string => this.takeClasses(params)
          };
          this.columns.push(col);
          this.columnValueRank['Col' + colIndex] = {
            100: 'cell-style2',
            200: 'cell-style3',
            300: 'cell-style4',
            400: 'cell-style5',
            500: 'cell-style6',
          };
        }
        if (this.cells[rowIndex]['Col' + colIndex] === undefined) {
          this.cells[rowIndex]['Col' + colIndex] = Math.floor(Math.random() * 500) + 1;
        }
      }
    }
    this.cellsSnapshot = this.cells;
  }

  public getData(rows: number, columns: number): Observable<{cells: any, columns: any}> {
    const source = interval(10000);
    return source.pipe(
      map(_ => {
          this.initData(rows, columns);
        return { columns: this.columns, cells: this.cells, columnGroup: this.columnGroup, columnValueRank: this.columnValueRank };
      }),
        take(1)
    );
  }

  private static takeDirection(values: string[]): any {
    const valuesCount: number = values.length;
    const randomPosition: number = Math.floor(Math.random() * valuesCount);
    return values[randomPosition];
  }

  private classForDigitValue(cellValue: string | number | null): string   {
    if (!cellValue) {
      return  cellValue === 0 ? 'digits-align' : '';
    }
    const replacedComma: string = cellValue.toString()
      .replace(/\./g, '')
      .replace(',', '.');

    return !isNaN(parseFloat(replacedComma)) ? 'digits-align' : '';
  }


  private takeClasses(params: any) {
    let classes = this.classForDigitValue(params.value) + ' ';
    const cell = params.colDef.field;
    const cell_value = params.value;
    if (this.columnValueRank[cell] !== undefined) {
      let back_style: string = 'cell-style1';
      for (const rank_value in  this.columnValueRank[cell]) {
        if (cell_value >= rank_value ) {
          back_style = this.columnValueRank[cell][rank_value];
        }
      }
      classes += back_style;
    }
    return classes;
  }

}
