import React, { useRef, useEffect } from 'react';
import { LayoutResult, PlacedItem } from '../types';
import { generateItemPositions } from '../utils/calculationUtils';

interface SheetPreviewProps {
  layout: LayoutResult;
  originalWidth: number;
  originalHeight: number;
}

const COLORS = ['#3B82F6', '#818CF8', '#60A5FA'];

const SheetPreview: React.FC<SheetPreviewProps> = ({ layout, originalWidth, originalHeight }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate the scale factor to fit the canvas
  const CANVAS_WIDTH = 330;
  const CANVAS_HEIGHT = 510; // 11:17 ratio
  const SHEET_WIDTH = 11;
  const SHEET_HEIGHT = 17;
  
  const scaleX = CANVAS_WIDTH / SHEET_WIDTH;
  const scaleY = CANVAS_HEIGHT / SHEET_HEIGHT;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sheet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // If no items fit, show a message
    if (layout.itemsPerSheet === 0) {
      ctx.fillStyle = '#EF4444';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Item too large to fit on sheet', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // Draw items
    const items = generateItemPositions(layout);
    items.forEach((item, index) => {
      const x = item.x * scaleX;
      const y = item.y * scaleY;
      const width = item.width * scaleX;
      const height = item.height * scaleY;
      
      // Fill with alternating colors
      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fillRect(x, y, width, height);
      
      // Draw border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      
      // Draw dimensions in the center of each item if large enough
      if (width > 40 && height > 20) {
        const dimensionText = layout.isRotated 
          ? `${originalHeight}" × ${originalWidth}"`
          : `${originalWidth}" × ${originalHeight}"`;
          
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dimensionText, x + width / 2, y + height / 2);
      }
    });
  }, [layout, scaleX, scaleY, originalWidth, originalHeight]);
  
  return (
    <div className="mt-4 bg-white p-2 border border-gray-300 rounded-md shadow-sm">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="mx-auto border border-gray-200"
      />
    </div>
  );
};

export default SheetPreview;