/**
 * Created by vova on 20.11.18.
 */
import { interval, Observable, of, Subscription } from 'rxjs';
import { sample, take, map, mergeMap, timestamp } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class MockDataService {
  private row: number = 5000;
  private col: number = 300;
  private columns: any[] = [];
  private cells: any[] = [];

  constructor() {

  }

  private initData(): void {

    for (let rowIndex = 0; rowIndex < this.row; rowIndex++) {
      if (this.cells[rowIndex] === undefined) {
        this.cells[rowIndex] = {};
      }
      for (let colIndex = 0; colIndex < this.col; colIndex++) {
        if (rowIndex === 0) {
          const col = {field: 'Col' + colIndex, headerName: 'Column ' + (1 + colIndex)};
          this.columns.push(col);
        }
        if (this.cells[rowIndex]['Col' + colIndex] === undefined) {
          this.cells[rowIndex]['Col' + colIndex] = Math.floor(Math.random() * 500) + 1;
        }
      }
    }
  }
  public getData(): Observable<{cells: any, columns: any}> {
    const source = interval(3000);
    return source.pipe(
      map(_ => {
        this.initData();
        return { columns: this.columns, cells: this.cells};
      }),
      take(3)
    );
  }
}
