import React from 'react';
import { Player } from '../types';
import { formatCurrency } from '../utils/calculations';
import { calculateOptimalPayments } from '../utils/paymentCalculator';

interface ResultsModalProps {
    players: Player[];
    onClose: () => void;
    onFinish: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ 
    players, 
    onClose,
    onFinish 
}) => {
    const payments = calculateOptimalPayments(players);
    const playerMap = players.reduce((acc, player) => {
        acc[player.id] = player;
        return acc;
    }, {} as { [key: string]: Player });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Final Balance</h3>
            {players.map(player => {
              const finalBalance = player.chipsAmount - player.buyIn;
              return (
                <div key={player.id} className="flex justify-between items-center">
                  <span className="font-medium">{player.name}</span>
                  <span className={`${
                    finalBalance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(finalBalance)}
                  </span>
                </div>
              );
            })}
          </div>
          {payments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Payments</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {payments.map((payment, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-red-600">
                      {playerMap[payment.from].name}
                    </span>
                    {' pays to '}
                    <span className="font-medium text-green-600">
                      {playerMap[payment.to].name}
                    </span>
                    {': '}
                    <span className="font-bold">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onFinish}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
};
