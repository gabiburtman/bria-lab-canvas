import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface FieldDeltaProps {
  oldValue: any;
  newValue: any;
  timestamp: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const FieldDelta: React.FC<FieldDeltaProps> = ({
  oldValue,
  newValue,
  timestamp,
  isExpanded = false,
  onToggle
}) => {
  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const oldStr = formatValue(oldValue);
  const newStr = formatValue(newValue);
  
  // Check if values are the same (shouldn't happen but safety check)
  if (oldStr === newStr) return null;

  return (
    <div className="field-delta">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-3 h-3 opacity-60" />
        <span className="text-xs opacity-60">Changed {formatTime(timestamp)}</span>
        {onToggle && (
          <button 
            onClick={onToggle}
            className="text-xs opacity-60 hover:opacity-100 ml-auto"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        )}
      </div>
      
      {isExpanded ? (
        <div className="space-y-2">
          <div>
            <div className="text-xs font-medium opacity-70 mb-1">Before:</div>
            <div className="delta-old font-mono text-xs p-1 rounded bg-lab-surface-elevated/30">
              {oldStr}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-3 h-3 opacity-50" />
          </div>
          <div>
            <div className="text-xs font-medium opacity-70 mb-1">After:</div>
            <div className="delta-new font-mono text-xs p-1 rounded bg-lab-surface-elevated/30">
              {newStr}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="delta-old">{oldStr.length > 30 ? oldStr.slice(0, 30) + '...' : oldStr}</span>
          <ArrowRight className="w-3 h-3 opacity-50" />
          <span className="delta-new">{newStr.length > 30 ? newStr.slice(0, 30) + '...' : newStr}</span>
        </div>
      )}
    </div>
  );
};