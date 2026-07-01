// Single source of truth for "how many items fit on a sheet" math.
// Replaces the separate, inconsistent logic that used to live inside
// PaperCalculator.tsx (no rotation, 12x18 sheet) and the old layout-calculator
// repo (rotation-aware, 11x17 sheet).

export interface SheetSize {
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

// Physical sheet is 12" x 18". PRINTABLE_AREA below already accounts for a
// standard margin around the edge of the physical sheet (this matches the
// original PaperCalculator behavior of using 11.5 x 17.5 as usable space).
export const PHYSICAL_SHEET: SheetSize = { width: 12, height: 18 };
export const PRINTABLE_AREA: SheetSize = { width: 11.5, height: 17.5 };

// Default bleed added around each item, in inches, on each side.
export const DEFAULT_BLEED = 0.2;

/**
 * Calculates how many copies of an item fit on a sheet, optionally trying
 * both orientations and picking whichever fits more (rotation-aware).
 */
export function calculateSheetLayout(
  itemWidthInches: number,
  itemHeightInches: number,
  usableArea: SheetSize = PRINTABLE_AREA,
  bleed: number = DEFAULT_BLEED,
  allowRotation: boolean = true
): LayoutResult {
  if (itemWidthInches <= 0 || itemHeightInches <= 0) {
    return {
      itemsPerSheet: 0,
      rows: 0,
      columns: 0,
      isRotated: false,
      itemWidth: itemWidthInches,
      itemHeight: itemHeightInches,
    };
  }

  const effWidth = itemWidthInches + bleed * 2;
  const effHeight = itemHeightInches + bleed * 2;

  const columnsNormal = Math.floor(usableArea.width / effWidth);
  const rowsNormal = Math.floor(usableArea.height / effHeight);
  const countNormal = columnsNormal * rowsNormal;

  if (!allowRotation) {
    return {
      itemsPerSheet: Math.max(1, countNormal),
      rows: rowsNormal,
      columns: columnsNormal,
      isRotated: false,
      itemWidth: itemWidthInches,
      itemHeight: itemHeightInches,
    };
  }

  const effWidthRotated = itemHeightInches + bleed * 2;
  const effHeightRotated = itemWidthInches + bleed * 2;

  const columnsRotated = Math.floor(usableArea.width / effWidthRotated);
  const rowsRotated = Math.floor(usableArea.height / effHeightRotated);
  const countRotated = columnsRotated * rowsRotated;

  if (countRotated > countNormal) {
    return {
      itemsPerSheet: Math.max(1, countRotated),
      rows: rowsRotated,
      columns: columnsRotated,
      isRotated: true,
      itemWidth: itemHeightInches,
      itemHeight: itemWidthInches,
    };
  }

  return {
    itemsPerSheet: Math.max(1, countNormal),
    rows: rowsNormal,
    columns: columnsNormal,
    isRotated: false,
    itemWidth: itemWidthInches,
    itemHeight: itemHeightInches,
  };
}

/** Given a target quantity and items-per-sheet, how many sheets are needed. */
export function calculateSheetsRequired(quantity: number, itemsPerSheet: number): number {
  if (itemsPerSheet <= 0) return 0;
  return Math.ceil(quantity / itemsPerSheet);
}
