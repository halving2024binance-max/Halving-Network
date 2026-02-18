import React from 'react';

const ProfessionalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-10]">
      {/* Dynamic Gradient Orbs - Color logic shifted to CSS variables */}
      <div 
        className="bg-orb top-[-10%] left-[-10%] animate-[orb-float_25s_infinite_alternate_ease-in-out]" 
        style={{ background: 'var(--orb-1)' }}
      />
      <div 
        className="bg-orb bottom-[-10%] right-[-10%] animate-[orb-float_30s_infinite_alternate-reverse_ease-in-out]" 
        style={{ background: 'var(--orb-2)' }}
      />
      <div 
        className="bg-orb top-[20%] right-[10%] w-[40vw] h-[40vw] animate-[orb-float_22s_infinite_alternate_ease-in-out]" 
        style={{ background: 'var(--orb-3)' }}
      />
      
      {/* Precision Scanning Line */}
      <div className="absolute inset-0 opacity-[0.03] overflow-hidden">
        <div className="w-full h-[1px] bg-theme-accent absolute top-0 left-0 animate-[scan-line_10s_linear_infinite]" />
      </div>

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      <style>{`
        @keyframes scan-line {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes orb-float {
            0% { transform: translate(-10%, -10%) scale(1); }
            100% { transform: translate(10%, 10%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalBackground;