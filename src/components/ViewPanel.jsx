import React from 'react';
import { seatViewsData } from '../data/seatViewsData';

// Receives onImageClick prop passed down from App.jsx
const ViewPanel = ({ sectionId, onShowRoute, onClose, onImageClick }) => {
  if (!sectionId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 border-l border-slate-800 text-slate-400 p-8 text-center font-sans">
        <div className="bg-slate-800 p-5 rounded-full mb-5 border border-slate-700 shadow-inner">
          <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </div>
        <p className="text-xl font-bold text-slate-200 tracking-wide">Select a section</p>
        <p className="text-sm mt-2 text-slate-500 max-w-xs">Click on any highlighted area on the map to explore seat views.</p>
      </div>
    );
  }

  const data = seatViewsData[sectionId];

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 border-l border-slate-800 text-slate-400 p-6 text-center font-sans relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="bg-slate-800 p-4 rounded-full mb-4 opacity-50">
          <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <p className="text-lg font-bold text-slate-200">No photos yet</p>
        <p className="text-sm text-slate-500 mt-2">We are currently collecting high-res photos for Section {sectionId.replace('sec-', '')}.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 font-sans relative z-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
        <h2 className="text-lg font-bold text-slate-100 tracking-wider">{data.name}</h2>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* IMAGE GRID - FIX ALIGNMENT ISSUES IN SMALL GRIDS */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-950/20">
        <div className="grid grid-cols-2 gap-3">
          {data.views.map((view, idx) => (
            // CLICKING THE IMAGE CALLS THE onImageClick PROP TO OPEN FULL-SCREEN MODAL IN APP
            <div 
              key={idx} 
              onClick={() => onImageClick(view.img)}
              className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer group flex flex-col shadow-inner"
            >
              <div className="relative h-28 overflow-hidden bg-slate-900 flex items-center justify-center">
                <img 
                  src={view.img} 
                  alt={`View from Row ${view.row}`} 
                  // ADD THIS ONERROR LINE:
                  onError={(e) => {
                    e.target.onerror = null; 
                    // Fallback image when the file does not exist
                    e.target.src = 'https://placehold.co/600x400/1e293b/475569?text=Image+Coming+Soon'; 
                  }}
                  className="max-w-full max-h-full object-contain rounded-t-xl rounded-b-xl group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-slate-200 text-sm">Row {view.row}</p>
                <p className="text-[11px] text-cyan-400 font-medium mt-0.5">{view.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-5 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <button onClick={onShowRoute} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all duration-300 flex justify-center items-center gap-2 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(8,145,178,0.4)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          SHOW ROUTE TO SEAT
        </button>
      </div>

    </div>
  );
};

export default ViewPanel;