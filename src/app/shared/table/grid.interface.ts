export interface GridInterface {
  onGridReady(params: any): void;
  onRowDataChanged(params: any): void;
  expandRows(): void;
  sizeToWidth(): void;
}
