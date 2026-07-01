import React from 'react';
import PrintCalculator from './components/PrintCalculator';
import { Home } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-white text-xl font-semibold">Printifile Layout Calculator</span>
          </div>
          <a
            href="https://printifile.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 font-medium"
          >
            <Home size={20} className="mr-2" />
            Back to Home Page
          </a>
        </div>
      </header>
      <div className="flex items-center justify-center py-8">
        <PrintCalculator />
      </div>
    </div>
  );
}

export default App;