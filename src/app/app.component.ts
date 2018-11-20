import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockDataService  } from './services/mock-data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public rowData: any[] = [];
  public columnDefs: any[] = [];
  public subscription: Subscription[] = [];

  constructor(private mockDataService: MockDataService
  ) {}
  ngOnInit() {
    this.subscription['mock_data'] = this.mockDataService.getData()
      .subscribe((data: {columns: any, cells: any}) => {
        this.rowData = data.cells;
        this.columnDefs = data.columns;
      });
  }

  ngOnDestroy() {
    for (const i in this.subscription) {
      this.subscription[i].unsubscribe();
    }
  }
}
