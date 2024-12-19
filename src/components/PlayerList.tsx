import React from 'react';
import { Player } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Trash2 } from 'lucide-react';

interface PlayerListProps {
    players: Player[];
    onRemovePlayer: (id: string) => void;
    onUpdateChips: (id: string, chips: number) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ 
    players, 
    onRemovePlayer,
    onUpdateChips 
}) => {
  return (
    <div className="space-y-4">
      {players.map(player => (
        <div 
          key={player.id} 
          className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
        >
          <div>
            <h3 className="font-medium text-gray-900">{player.name}</h3>
            <p className="text-sm text-gray-500">
              Buy-in: {formatCurrency(player.buyIn)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={player.chipsAmount}
              onChange={(e) => onUpdateChips(player.id, Number(e.target.value))}
              className="w-24 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="100"
            />
            <button
              onClick={() => onRemovePlayer(player.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
