import React, { useState, useEffect } from 'react';
import { FormControl } from './FormControl';
import { CostDisplay } from './CostDisplay';
import { convertToInches, paperMaterialOptions, stickerMaterialOptions } from '../utils/calculatorUtils';
import { paperPricing, stickerPricing } from '../data/pricing';
import { calculateSheetLayout, calculateSheetsRequired } from '../utils/sheetLayout';

type Material = 'paper' | 'sticker';
type PaperGSM = '200' | '250' | '300' | '100' | '130' | '170';
type StickerType = 'Paper sticker' | 'Mirrorcoat' | 'Nontearable' | 'Gold' | 'Silver' | 'Holographic'| 'NT opaque'| 'paper sticker thick'|   'paper sticker thin'|   'NT sticker'|  'woodfree white'|  'transparent sticker'|  'NT matt thick' ;
type Unit = 'inches' | 'mm' | 'cm' | 'feet';
type PrintSide = 'single' | 'double';

export const PaperCalculator: React.FC = () => {
  const [width, setWidth] = useState<number>(8.5);
  const [height, setHeight] = useState<number>(11);
  const [unit, setUnit] = useState<Unit>('inches');
  const [material, setMaterial] = useState<Material>('paper');
  const [paperGSM, setPaperGSM] = useState<PaperGSM>('250');
  const [stickerType, setStickerType] = useState<StickerType>('Paper sticker');
  const [printSide, setPrintSide] = useState<PrintSide>('single');
  const [quantity, setQuantity] = useState<number>(100);
  const [hardLamination, setHardLamination] = useState<boolean>(false);
  const [softLamination, setSoftLamination] = useState<boolean>(false);
  
  // Results
  const [totalCost, setTotalCost] = useState<number>(0);
  const [sheetsRequired, setSheetsRequired] = useState<number>(0);
  const [itemsPerSheet, setItemsPerSheet] = useState<number>(0);

  const calculateResults = () => {
    // Convert dimensions to inches
    const widthInInches = convertToInches(width, unit);
    const heightInInches = convertToInches(height, unit);

    // Shared layout engine: tries both orientations and picks whichever
    // fits more items per sheet (rotation-aware), using the standard
    // printable area and bleed.
    const layout = calculateSheetLayout(widthInInches, heightInInches);
    const itemsPerSheetCalc = layout.itemsPerSheet;
    setItemsPerSheet(itemsPerSheetCalc);

    const sheetsRequiredCalc = calculateSheetsRequired(quantity, itemsPerSheetCalc);
    setSheetsRequired(sheetsRequiredCalc);
    
    // Calculate cost based on material and quantity
    let pricePerSheet = 0;
    
    if (material === 'paper') {
      // Check if pricing exists for the selected paper GSM
      if (!paperPricing[paperGSM]) {
        console.error(`No pricing found for paper GSM: ${paperGSM}`);
        setTotalCost(0);
        return;
      }

      // Find the correct price tier based on quantity
      const priceTiers = Object.keys(paperPricing[paperGSM]);
      if (!priceTiers.length) {
        console.error(`No price tiers found for paper GSM: ${paperGSM}`);
        setTotalCost(0);
        return;
      }

      const priceTier = priceTiers
        .map(Number)
        .sort((a, b) => a - b)
        .find(tier => sheetsRequiredCalc <= tier) || Math.max(...priceTiers.map(Number));
      
      const side = printSide === 'single' ? 'singleSided' : 'doubleSided';
      
      if (!paperPricing[paperGSM][priceTier]?.[side]) {
        console.error(`No pricing found for ${side} printing at tier ${priceTier}`);
        setTotalCost(0);
        return;
      }

      pricePerSheet = paperPricing[paperGSM][priceTier][side];
    } else {
      // Check if pricing exists for the selected sticker type
      if (!stickerPricing[stickerType]) {
        console.error(`No pricing found for sticker type: ${stickerType}`);
        setTotalCost(0);
        return;
      }

      // Find the correct price tier based on quantity
      const priceTiers = Object.keys(stickerPricing[stickerType]);
      if (!priceTiers.length) {
        console.error(`No price tiers found for sticker type: ${stickerType}`);
        setTotalCost(0);
        return;
      }

      const priceTier = priceTiers
        .map(Number)
        .sort((a, b) => a - b)
        .find(tier => sheetsRequiredCalc <= tier) || Math.max(...priceTiers.map(Number));
      
      if (!stickerPricing[stickerType][priceTier]) {
        console.error(`No pricing found for tier ${priceTier}`);
        setTotalCost(0);
        return;
      }

      pricePerSheet = stickerPricing[stickerType][priceTier];
    }
    
    // Calculate total cost
    let totalCostCalc = pricePerSheet * sheetsRequiredCalc;
    
    // Add lamination costs if selected (pricing for lamination not provided, using placeholder values)
    if (hardLamination) totalCostCalc += sheetsRequiredCalc * 30; // Placeholder: Rs. 30 per sheet for hard lamination — replace with your real rate
    if (softLamination) totalCostCalc += sheetsRequiredCalc * 5; // Placeholder: Rs. 5 per sheet for soft lamination — replace with your real rate
    
    setTotalCost(totalCostCalc);
  };

  // Recalculate whenever input values change
  useEffect(() => {
    calculateResults();
  }, [width, height, unit, material, paperGSM, stickerType, printSide, quantity, hardLamination, softLamination]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Paper/Sticker Options</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormControl label="Width">
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.1"
              step="0.1"
            />
          </FormControl>
          
          <FormControl label="Height">
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.1"
              step="0.1"
            />
          </FormControl>
        </div>
        
        <FormControl label="Unit">
          <div className="grid grid-cols-4 gap-2">
            {['inches', 'mm', 'cm', 'feet'].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u as Unit)}
                className={`py-2 px-3 rounded-md border transition-colors ${
                  unit === u 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </FormControl>
        
        <FormControl label="Material Type">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMaterial('paper')}
              className={`py-2 px-3 rounded-md border transition-colors ${
                material === 'paper' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Paper
            </button>
            <button
              onClick={() => setMaterial('sticker')}
              className={`py-2 px-3 rounded-md border transition-colors ${
                material === 'sticker' 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Sticker
            </button>
          </div>
        </FormControl>
        
        {material === 'paper' ? (
          <FormControl label="Paper GSM">
            <select
              value={paperGSM}
              onChange={(e) => setPaperGSM(e.target.value as PaperGSM)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {paperMaterialOptions.map((option) => (
                <option key={option} value={option}>
                  {option} GSM
                </option>
              ))}
            </select>
          </FormControl>
        ) : (
          <FormControl label="Sticker Type">
            <select
              value={stickerType}
              onChange={(e) => setStickerType(e.target.value as StickerType)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stickerMaterialOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormControl>
        )}
        
        {material === 'paper' && (
          <FormControl label="Print Side">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPrintSide('single')}
                className={`py-2 px-3 rounded-md border transition-colors ${
                  printSide === 'single' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Single Sided
              </button>
              <button
                onClick={() => setPrintSide('double')}
                className={`py-2 px-3 rounded-md border transition-colors ${
                  printSide === 'double' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Double Sided
              </button>
            </div>
          </FormControl>
        )}
        
        <FormControl label="Quantity">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            step="1"
          />
        </FormControl>
        
        <FormControl label="Lamination">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={hardLamination}
                onChange={(e) => setHardLamination(e.target.checked)}
                className="form-checkbox rounded text-blue-500 focus:ring-blue-500"
              />
              <span>Hard Lamination</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={softLamination}
                onChange={(e) => setSoftLamination(e.target.checked)}
                className="form-checkbox rounded text-blue-500 focus:ring-blue-500"
              />
              <span>Soft Lamination</span>
            </label>
          </div>
        </FormControl>
      </div>
      
      <div className="flex flex-col justify-center">
        <CostDisplay
          totalCost={totalCost}
          additionalInfo={[
            { label: 'Sheets Required', value: sheetsRequired.toString() },
            { label: 'Items Per Sheet', value: itemsPerSheet.toString() }
          ]}
        />
      </div>
    </div>
  );
};
