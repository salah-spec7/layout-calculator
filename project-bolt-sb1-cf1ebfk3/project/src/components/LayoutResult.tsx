import React from 'react';
import { LayoutResult as LayoutResultType } from '../types';
import { calculateUsagePercentage } from '../utils/calculationUtils';

interface LayoutResultProps {
  layout: LayoutResultType;
  originalWidth: number;
  originalHeight: number;
}

const LayoutResult: React.FC<LayoutResultProps> = ({ layout, originalWidth, originalHeight }) => {
  const { itemsPerSheet, rows, columns, isRotated } = layout;
  const usagePercentage = calculateUsagePercentage(layout);
  
  if (itemsPerSheet === 0) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-md">
        <h3 className="text-lg font-semibold text-red-700">Cannot fit on sheet</h3>
        <p className="text-red-600">
          The item is too large to fit on an 11" × 17" sheet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="mt-6 p-4 bg-primary/10 border border-primary rounded-md transition-all duration-300">
      <h3 className="text-lg font-semibold text-secondary">Results</h3>
      
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-md border border-primary shadow-sm">
          <p className="text-secondary text-sm">Items per sheet</p>
          <p className="text-3xl font-bold text-primary">{itemsPerSheet}</p>
        </div>
        
        <div className="bg-white p-3 rounded-md border border-primary shadow-sm">
          <p className="text-secondary text-sm">Sheet usage</p>
          <p className="text-3xl font-bold text-primary">{usagePercentage.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-secondary">
          <span className="font-medium">Layout: </span>
          {columns} × {rows} ({columns} across, {rows} down)
        </p>
        
        <p className="text-secondary">
          <span className="font-medium">Orientation: </span>
          {isRotated ? (
            <>Rotated ({originalHeight}" × {originalWidth}")</>
          ) : (
            <>Normal ({originalWidth}" × {originalHeight}")</>
          )}
        </p>
      </div>
    </div>
  );
};

export default LayoutResult;