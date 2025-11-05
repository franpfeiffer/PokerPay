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

    const groupedTransactions = uniqueTransactions.reduce((acc, transaction) => {
        const key = `${transaction.to}-${transaction.timestamp.getTime()}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(transaction);
        return acc;
    }, {} as { [key: string]: typeof uniqueTransactions });

    const sortedGroups = Object.entries(groupedTransactions)
    .sort(([, a], [, b]) => b[0].timestamp.getTime() - a[0].timestamp.getTime());

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

                {sortedGroups.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No rebuys yet</p>
                ) : (
                        <div className="space-y-3">
                            {sortedGroups.map(([key, transactions]) => {
                                const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
                                const totalChips = transactions.reduce((sum, t) => sum + t.chips, 0);
                                const buyer = playerMap[transactions[0].to];

                                return (
                                    <div
                                        key={key}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <span className="font-medium text-blue-600">
                                                    {buyer?.name}
                                                </span>
                                                <span className="text-gray-600"> bought chips</span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatTime(transactions[0].timestamp)}
                                            </span>
                                        </div>

                                        {transactions.length === 1 ? (
                                            <div className="ml-4 text-sm text-gray-600">
                                                from <span className="font-medium text-purple-600">
                                                    {playerMap[transactions[0].from]?.name}
                                                </span>
                                            </div>
                                        ) : (
                                                <div className="ml-4 space-y-1">
                                                    <div className="text-sm text-gray-600">from multiple sellers:</div>
                                                    {transactions.map((t, idx) => (
                                                        <div key={idx} className="text-sm text-gray-600 ml-4">
                                                            • <span className="font-medium text-purple-600">
                                                                {playerMap[t.from]?.name}
                                                            </span>
                                                            {' '}({t.chips} chips for {formatCurrency(t.amount)})
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        <div className="flex gap-4 text-sm mt-2 pt-2 border-t">
                                            <span className="text-gray-700">
                                                Total Cash: <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                                            </span>
                                            <span className="text-gray-700">
                                                Total Chips: <span className="font-semibold">{totalChips}</span>
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
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
