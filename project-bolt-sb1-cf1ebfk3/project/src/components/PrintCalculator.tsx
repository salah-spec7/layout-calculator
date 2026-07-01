import React, { useState, useEffect } from 'react';
import { Printer, RotateCw, Save } from 'lucide-react';
import DimensionInput from './DimensionInput';
import SheetPreview from './SheetPreview';
import LayoutResult from './LayoutResult';
import { calculateLayout } from '../utils/calculationUtils';
import { ItemDimension, LayoutResult as LayoutResultType } from '../types';

const PrintCalculator: React.FC = () => {
  const [itemDimension, setItemDimension] = useState<ItemDimension>({
    width: 3.5,
    height: 2
  });
  
  const [allowRotation, setAllowRotation] = useState<boolean>(true);
  const [layout, setLayout] = useState<LayoutResultType>({
    itemsPerSheet: 0,
    rows: 0,
    columns: 0,
    isRotated: false,
    itemWidth: 0,
    itemHeight: 0
  });
  
  useEffect(() => {
    const newLayout = calculateLayout(itemDimension, allowRotation);
    setLayout(newLayout);
  }, [itemDimension, allowRotation]);
  
  const handleWidthChange = (width: number) => {
    setItemDimension(prev => ({ ...prev, width }));
  };
  
  const handleHeightChange = (height: number) => {
    setItemDimension(prev => ({ ...prev, height }));
  };
  
  const handleRotationToggle = () => {
    setAllowRotation(prev => !prev);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSave = () => {
    alert('Layout saved!');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-primary transition-all duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">
          Print Layout Calculator
        </h1>
      </div>
      
      <p className="mt-2 text-secondary">
        Calculate how many items can fit on a standard 11" × 17" sheet of paper.
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-secondary mb-4">Item Dimensions</h2>
          
          <DimensionInput 
            label="Width" 
            value={itemDimension.width} 
            onChange={handleWidthChange} 
          />
          
          <DimensionInput 
            label="Height" 
            value={itemDimension.height} 
            onChange={handleHeightChange} 
          />
          
          <div className="mt-6">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={allowRotation}
                  onChange={handleRotationToggle}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors duration-200 ${allowRotation ? 'bg-primary' : 'bg-gray-300'}`}>
                </div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition duration-200 ${allowRotation ? 'transform translate-x-4' : ''}`}>
                </div>
              </div>
              <div className="ml-3 flex items-center text-secondary">
                <RotateCw size={16} className="mr-1" />
                Allow item rotation
              </div>
            </label>
          </div>
          
          <LayoutResult 
            layout={layout} 
            originalWidth={itemDimension.width} 
            originalHeight={itemDimension.height} 
          />
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-primary text-secondary rounded-md hover:bg-yellow-400 transition-colors duration-200"
            >
              <Printer size={16} className="mr-1" />
              Print Layout
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-secondary text-primary rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              <Save size={16} className="mr-1" />
              Save Layout
            </button>
          </div>
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-secondary mb-4">Sheet Preview (11" × 17")</h2>
          
          <div className="flex-grow flex flex-col items-center justify-center">
            <SheetPreview 
              layout={layout} 
              originalWidth={itemDimension.width} 
              originalHeight={itemDimension.height} 
            />
            
            <p className="mt-3 text-sm text-secondary text-center">
              This preview shows how the items will be arranged on an 11" × 17" sheet.
              {layout.isRotated && allowRotation && (
                <span className="block font-medium text-primary mt-1">
                  Items have been rotated for optimal fit.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintCalculator;