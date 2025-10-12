import React from 'react';
import { Player } from '../types';
import { formatCurrency } from '../utils/calculations';

interface TransactionHistoryProps {
    players: Player[];
    onClose: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ players, onClose }) => {
    const allTransactions = players
        .flatMap(player => player.transactions)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const uniqueTransactions = allTransactions.filter((transaction, index, self) =>
        index === self.findIndex(t => t.id === transaction.id)
    );

    const playerMap = players.reduce((acc, player) => {
        acc[player.id] = player;
        return acc;
    }, {} as { [key: string]: Player });

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

                {uniqueTransactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No rebuys yet</p>
                ) : (
                    <div className="space-y-3">
                        {uniqueTransactions.map(transaction => (
                            <div
                                key={transaction.id}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <span className="font-medium text-blue-600">
                                            {playerMap[transaction.to]?.name}
                                        </span>
                                        <span className="text-gray-600"> bought from </span>
                                        <span className="font-medium text-purple-600">
                                            {playerMap[transaction.from]?.name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {formatTime(transaction.timestamp)}
                                    </span>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-gray-700">
                                        Cash: <span className="font-semibold">{formatCurrency(transaction.amount)}</span>
                                    </span>
                                    <span className="text-gray-700">
                                        Chips: <span className="font-semibold">{transaction.chips}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-3">Player Summary</h3>
                    <div className="space-y-2">
                        {players.map(player => (
                            <div key={player.id} className="flex justify-between text-sm">
                                <span className="font-medium">{player.name}</span>
                                <div className="text-right">
                                    <div className="text-gray-600">
                                        Initial: {formatCurrency(player.initialBuyIn)}
                                    </div>
                                    <div className="font-semibold text-blue-600">
                                        Total In: {formatCurrency(player.totalCashIn)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
