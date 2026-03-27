import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { allStadiumSections, routeData } from '../data/stadiumData';

const InteractiveMap = ({ onSectionClick, activeRoute, selectedSection }) => {
  // TOOLTIP STATE: Manages visibility, position, and content of the hover tooltip
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '', subtext: '' });
  
  // STADIUM ROTATION STATE: Toggles between horizontal and vertical views
  const [isVertical, setIsVertical] = useState(false);
  
  // REFERENCE TO TRANSFORM WRAPPER: Used to trigger programmatic zoom/pan actions
  const transformRef = useRef(null);

  // CAMERA EFFECT: Smart Zoom & Pan based on user interactions
  useEffect(() => {
    if (transformRef.current) {
      const { zoomToElement, resetTransform } = transformRef.current;
      
      // Priority 1: When showing a route, zoom out to see the full stadium map
      if (activeRoute) {
        resetTransform(700, "easeOutCubic");
      } 
      // Priority 2: When a section is clicked, zoom closely into that specific area
      else if (selectedSection) {
        zoomToElement(selectedSection, 2.5, 700, "easeOutCubic");
      } 
      // Priority 3: When selection is cleared, reset to the default full view
      else {
        resetTransform(700, "easeOutCubic");
      }
    }
  }, [selectedSection, activeRoute]);

  // HANDLER: Updates tooltip position based on mouse movement over sections
  const handleMouseMove = (e, section) => {
    setTooltip({ visible: true, x: e.clientX + 20, y: e.clientY + 20, text: section.name, subtext: section.subtext });
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden rounded-2xl border border-slate-700 shadow-2xl font-sans">
      
      {/* COMPASS BUTTON: Located at the top-right corner to toggle map orientation */}
      <button 
        onClick={() => setIsVertical(!isVertical)} 
        className={`absolute top-6 right-6 z-50 w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg border border-slate-700 active:scale-95 ${isVertical ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-800/80 text-cyan-400 hover:bg-slate-700 backdrop-blur-md'}`} 
        title="Toggle Map Orientation"
      >
        <svg className={`w-6 h-6 transition-transform duration-700 ${isVertical ? 'rotate-90' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
      </button>

      {/* TOOLTIP COMPONENT: Follows the cursor when hovering over interactive elements */}
      {tooltip.visible && (
        <div className="fixed z-[60] flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl pointer-events-none backdrop-blur-sm" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex flex-shrink-0 items-center justify-center border border-cyan-500/50">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
          </div>
          <div><p className="text-sm font-bold text-slate-100">{tooltip.text}</p><p className="text-xs text-slate-400">{tooltip.subtext}</p></div>
        </div>
      )}

      {/* INTERACTIVE ZOOM WRAPPER */}
      <TransformWrapper 
        ref={transformRef} 
        initialScale={1} 
        minScale={0.5} 
        maxScale={4} 
        wheel={{ step: 0.1 }}
        // FIX VERCEL DEPLOYMENT BUG: Forces centering after a tiny delay to ensure proper dimensions
        onInit={(ref) => {
          setTimeout(() => {
            ref.centerView(1, 0); 
          }, 50);
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <React.Fragment>
            {/* FIX VERCEL DEPLOYMENT BUG: 
                Using inline styles (wrapperStyle & contentStyle) guarantees the container 
                is fully sized before the map library calculates the center point. 
            */}
            <TransformComponent 
              wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }} 
              contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg viewBox="0 0 1000 800" className="w-full h-auto max-h-full">
                
                {/* MAIN ROTATION GROUP: 
                    Smoothly rotates the entire stadium (90 degrees) when compass is clicked 
                */}
                <g 
                  transform={`rotate(${isVertical ? 90 : 0} 500 400)`} 
                  className="transition-transform duration-700 ease-in-out"
                >
                  
                  {/* TENNIS COURT GRAPHICS */}
                  <g className="drop-shadow-lg">
                    {/* Outer court boundary */}
                    <rect x="330" y="320" width="340" height="160" fill="#1e3a8a" rx="4" />
                    {/* Inner playing surface */}
                    <rect x="360" y="335" width="280" height="130" fill="#0ea5e9" />
                    
                    {/* Court boundary lines */}
                    <rect x="360" y="335" width="280" height="130" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
                    {/* Singles and doubles sidelines */}
                    <line x1="360" y1="355" x2="640" y2="355" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                    <line x1="360" y1="445" x2="640" y2="445" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                    {/* Service boxes */}
                    <line x1="430" y1="355" x2="430" y2="445" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                    <line x1="570" y1="355" x2="570" y2="445" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                    {/* Center service line */}
                    <line x1="430" y1="400" x2="570" y2="400" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                    {/* Center marks */}
                    <line x1="360" y1="400" x2="365" y2="400" stroke="#ffffff" strokeWidth="2" />
                    <line x1="635" y1="400" x2="640" y2="400" stroke="#ffffff" strokeWidth="2" />
                    
                    {/* Net & Net Posts */}
                    <line x1="500" y1="325" x2="500" y2="475" stroke="#ffffff" strokeWidth="3" strokeDasharray="3 2" opacity="0.9" />
                    <circle cx="500" cy="325" r="2.5" fill="#94a3b8" />
                    <circle cx="500" cy="475" r="2.5" fill="#94a3b8" />

                    {/* UMPIRE CHAIR: Interactive point showing the official's position */}
                    <g 
                      className="cursor-help group"
                      onMouseMove={(e) => handleMouseMove(e, { name: "Umpire's Chair", subtext: "Match Official" })} 
                      onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                    >
                      <circle cx="500" cy="310" r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" className="transition-all duration-300 group-hover:fill-yellow-400 group-hover:stroke-cyan-300" />
                      <circle cx="500" cy="310" r="2.5" fill="#ffffff" />
                    </g>
                  </g>

                  {/* ROUTING PATH EFFECT: Draws the neon path from gate to section */}
                  {activeRoute && routeData[activeRoute] && (
                    <g>
                      {/* Blurred shadow for neon glow effect */}
                      <path d={routeData[activeRoute].path} fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="opacity-30 blur-sm" />
                      {/* Animated dashed line for directional flow */}
                      <path d={routeData[activeRoute].path} fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="route-wave" />
                      {/* Gate name label (counter-rotates to stay upright) */}
                      <text 
                        x={routeData[activeRoute].gateLocation.x - 35} 
                        y={routeData[activeRoute].gateLocation.y - 15} 
                        fontSize="14" fill="#4ade80" fontWeight="bold" 
                        transform={`rotate(${isVertical ? -90 : 0} ${routeData[activeRoute].gateLocation.x} ${routeData[activeRoute].gateLocation.y})`} 
                        className="drop-shadow-md transition-transform duration-700 ease-in-out"
                      >
                        {routeData[activeRoute].gateName}
                      </text>
                    </g>
                  )}

                  {/* SEATING SECTIONS & LABELS */}
                  {allStadiumSections.map((sec) => {
                    // Check whether this section is currently selected (from chatbox or manual click)
                    const isSelected = selectedSection === sec.id;

                    return (
                      <g 
                        key={sec.id} 
                        className={`cursor-pointer group ${isSelected ? 'z-10' : ''}`} 
                        onMouseMove={(e) => handleMouseMove(e, sec)} 
                        onMouseLeave={() => setTooltip({ ...tooltip, visible: false })} 
                        onClick={() => onSectionClick(sec.id)}
                      >
                        <path 
                          id={sec.id} 
                          d={sec.path} 
                          // If selected, switch to bright cyan with a glow effect
                          className={`
                            ${isSelected ? 'fill-cyan-400 stroke-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' : sec.colorClass} 
                            stroke-[2px] transition-all duration-500 ease-out group-hover:stroke-white
                          `} 
                        />
                        <text 
                          x={sec.labelLocation.x} 
                          y={sec.labelLocation.y} 
                          textAnchor="middle" 
                          dominantBaseline="central" 
                          transform={`rotate(${isVertical ? -90 : 0} ${sec.labelLocation.x} ${sec.labelLocation.y})`} 
                          // If selected, automatically brighten label text to white
                          className={`
                            ${isSelected ? 'fill-white opacity-100 font-extrabold' : 'fill-slate-300 opacity-60 font-bold'} 
                            text-[11px] tracking-tight pointer-events-none transition-all duration-300
                          `}
                          style={{
                            textShadow: isSelected ? '0px 0px 8px rgba(255, 255, 255, 0.9)' : 'none'
                          }}
                        >
                          {sec.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </TransformComponent>

            {/* ZOOM CONTROLS: Floating buttons at the bottom-left */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-40 bg-slate-900/80 p-1.5 rounded-2xl backdrop-blur-md border border-slate-700 shadow-xl">
              <button onClick={() => zoomIn()} className="w-10 h-10 bg-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors active:scale-95" title="Zoom In"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg></button>
              <button onClick={() => zoomOut()} className="w-10 h-10 bg-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors active:scale-95" title="Zoom Out"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg></button>
              <button onClick={() => resetTransform()} className="w-10 h-10 bg-slate-800 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors active:scale-95" title="Reset View"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
            </div>
            
            {/* CSS ANIMATIONS: Defines the continuous wave effect for the routing path */}
            <style>{`
              @keyframes flowWave { 
                from { stroke-dashoffset: 40; } 
                to { stroke-dashoffset: 0; } 
              }
              .route-wave { 
                stroke-dasharray: 20 20; 
                animation: flowWave 1.5s linear infinite; 
              }
            `}</style>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
};

export default InteractiveMap;