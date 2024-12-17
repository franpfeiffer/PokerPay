import React from 'react';
import { PokerTable } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Users, DollarSign } from 'lucide-react';

interface TableCardProps {
  table: PokerTable;
  onSelect: (table: PokerTable) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(table)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{table.name}</h3>
        <span className={`px-2 py-1 rounded-full text-sm ${
          table.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {table.isActive ? 'Active' : 'Ended'}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <span>{table.players.length} players</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={20} />
          <span>{formatCurrency(table.totalPot)}</span>
        </div>
      </div>
    </div>
  );
};
