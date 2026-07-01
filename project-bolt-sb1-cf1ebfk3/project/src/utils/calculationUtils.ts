import { ItemDimension, LayoutResult, PlacedItem } from '../types';

const SHEET_WIDTH = 11;
const SHEET_HEIGHT = 17;

/**
 * Calculate how many items can fit on a sheet with given dimensions
 */
export function calculateLayout(itemDimension: ItemDimension, allowRotation: boolean): LayoutResult {
  const { width, height } = itemDimension;
  
  // Check if dimensions are valid
  if (width <= 0 || height <= 0) {
    return {
      itemsPerSheet: 0,
      rows: 0,
      columns: 0,
      isRotated: false,
      itemWidth: width,
      itemHeight: height
    };
  }

  // Calculate layout without rotation
  const columnsNormal = Math.floor(SHEET_WIDTH / width);
  const rowsNormal = Math.floor(SHEET_HEIGHT / height);
  const countNormal = columnsNormal * rowsNormal;

  // If rotation is not allowed, return normal layout
  if (!allowRotation) {
    return {
      itemsPerSheet: countNormal,
      rows: rowsNormal,
      columns: columnsNormal,
      isRotated: false,
      itemWidth: width,
      itemHeight: height
    };
  }

  // Calculate layout with rotation
  const columnsRotated = Math.floor(SHEET_WIDTH / height);
  const rowsRotated = Math.floor(SHEET_HEIGHT / width);
  const countRotated = columnsRotated * rowsRotated;

  // Return the layout with the most items
  if (countRotated > countNormal) {
    return {
      itemsPerSheet: countRotated,
      rows: rowsRotated,
      columns: columnsRotated,
      isRotated: true,
      itemWidth: height,
      itemHeight: width
    };
  } else {
    return {
      itemsPerSheet: countNormal,
      rows: rowsNormal,
      columns: columnsNormal,
      isRotated: false,
      itemWidth: width,
      itemHeight: height
    };
  }
}

/**
 * Generate positions for all items on the sheet
 */
export function generateItemPositions(layout: LayoutResult): PlacedItem[] {
  const { rows, columns, itemWidth, itemHeight } = layout;
  const items: PlacedItem[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      items.push({
        x: col * itemWidth,
        y: row * itemHeight,
        width: itemWidth,
        height: itemHeight
      });
    }
  }

  return items;
}

/**
 * Calculate the usage percentage of the sheet
 */
export function calculateUsagePercentage(layout: LayoutResult): number {
  if (layout.itemsPerSheet === 0) return 0;
  
  const totalItemArea = layout.itemsPerSheet * layout.itemWidth * layout.itemHeight;
  const sheetArea = SHEET_WIDTH * SHEET_HEIGHT;
  
  return (totalItemArea / sheetArea) * 100;
}