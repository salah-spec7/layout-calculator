export interface ItemDimension {
  width: number;
  height: number;
}

export interface LayoutResult {
  itemsPerSheet: number;
  rows: number;
  columns: number;
  isRotated: boolean;
  itemWidth: number;
  itemHeight: number;
}

export interface PlacedItem {
  x: number;
  y: number;
  width: number;
  height: number;
}