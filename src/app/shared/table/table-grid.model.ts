import { RowNode } from 'ag-grid-community/src/ts/entities/rowNode';

export type TableGridDataRow = {
  groupFactors?: {[group_factor: string]: any},
  factorProperties?: {[factor_property: string]: number | boolean }
};

export type TableCoumnGroup = {
  headerName: string,
  field?: string,
  width?: number,
  minWidth?: number,
  pinned?: string,
  cellRendererParams?: any,
  filter?: any,
  filterParams?: any,
  comparator?: any,
};

export type TableColumn = {
  headerName: string,
  field?: string,
  width?: number,
  minWidth?: number,
  maxWidth?: number,
  rowGroup?: boolean,
  hide?: boolean,
  children?: TableColumn[],
  cellClassRules?: any,
  pinned?: string,
  rowClass?: string,
  cellClass?: any,
  cellStyle?: (params: any) => any,    //{[style_key: string]: string },
  cellRenderer?: ((params: any) => string | HTMLElement) | string,
  valueFormatter?: (params: any) => any,
  suppressMenu?: boolean,
  headerClass?: any,
  headerTooltip?: string,
  comparator?: (valueA: string, valueB: string, nodeA: any, nodeB: any, isInverted: boolean) =>  number,
  filter?: string
  filterParams?: any,
  suppressFilter?: boolean,
  showRowGroup?: string,
  filterValueGetter?: any
};

export type TableOptions = {
  groupUseEntireRow: boolean,
  enableSorting: boolean,
  enableRangeSelection: boolean,
  enableColResize: boolean,
  showExpandButton?: boolean,
  showFitToSizeButton?: boolean,
  wrapperHeight?: string,
  headerHeight?: number
  groupHeaderHeight?: number,
  enableFilter?: boolean,
  groupMultiAutoColumn?: boolean,
  groupSuppressAutoColumn?: boolean,
  rowDoubleClicked?: any,
  cellDoubleClicked?: any,
};
export type TableRowClassRules = { [cssClassName: string]: (params: any) => boolean };

export type TableGridData = {
  columns: TableColumn[],
  columnGroup: TableCoumnGroup,
  data: TableGridDataRow[],
  agregation?: TableAgreagtionCallback,
  options?: TableOptions,
  pinnedBottomRowData?: TableGridDataRow[],
  pinnedTopRowData?: TableGridDataRow[],
  rowClassRules?: TableRowClassRules
};

export type TableAgregationFactor = {
  agregationProperties?: {[agregationProperty: string]: number | string | null }
};
export type TableAgreagtionCallback = (nodes: RowNode[], agregationSnapshot: TableAgregationFactor, autoGroupColumnDef: TableCoumnGroup) => TableAgregationFactor;

export class TableGridModel {

  set columnGroup(value: TableCoumnGroup) {
    this._columnGroup = value;
  }

  set rowClassRules(value: TableRowClassRules) {
    this._rowClassRules = value;
  }

  set agregation(value: TableAgreagtionCallback) {
    this._agregation = value;
  }

  set pinnedBottomRowData(value: TableGridDataRow[]) {
    this._pinnedBottomRowData = value;
  }

  set pinnedTopRowData(value: TableGridDataRow[]) {
    this._pinnedTopRowData = value;
  }

  set options(value: TableOptions) {
    this._options = value;
  }

  set rowData(value: TableGridDataRow[]) {
    this._rowData = value;
  }

  set columns(value: TableColumn[]) {
    this._columns = value;
  }

  get rowClassRules(): TableRowClassRules {
    return this._rowClassRules;
  }

  get agregation(): TableAgreagtionCallback {
    return this._agregation;
  }

  get pinnedBottomRowData(): TableGridDataRow[] {
    return this._pinnedBottomRowData;
  }

  get pinnedTopRowData(): TableGridDataRow[] {
    return this._pinnedTopRowData;
  }

  get options(): TableOptions {
    return this._options;
  }

  get rowData(): TableGridDataRow[] {
    return this._rowData;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }

  get columnGroup(): TableCoumnGroup {
    return this._columnGroup;
  }

  private _rowClassRules: TableRowClassRules;
  private _agregation: TableAgreagtionCallback;
  private _pinnedBottomRowData: TableGridDataRow[];
  private _pinnedTopRowData: TableGridDataRow[];
  private _options: TableOptions;
  private _rowData: TableGridDataRow[];
  private _columns: TableColumn[];
  private _columnGroup: TableCoumnGroup;

  constructor() {}
}
