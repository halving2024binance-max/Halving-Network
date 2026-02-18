
import React from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { SECURITY_LAYERS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const SecurityStack: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6" />
        12-LAYER SECURITY STACK
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECURITY_LAYERS.map((layer) => (
          <div 
            key={layer.id}
            className="bg-slate-900/50 border border-slate-700 p-4 rounded-xl hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-slate-500 uppercase">Layer {layer.id.toString().padStart(2, '0')}</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={layer.status}
                  initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {layer.status === 'active' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  {layer.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {layer.status === 'alert' && <XCircle className="w-4 h-4 text-rose-500" />}
                </motion.div>
              </AnimatePresence>
            </div>
            <h4 className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
              {layer.name}
            </h4>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              {layer.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityStack;
