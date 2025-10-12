import React, { useState } from 'react';
import { Player } from '../types';

interface RebuyModalProps {
    player: Player;
    players: Player[];
    onClose: () => void;
    onRebuy: (sellerId: string, amount: number, chips: number) => void;
}

export const RebuyModal: React.FC<RebuyModalProps> = ({
    player,
    players,
    onClose,
    onRebuy
}) => {
    const [sellerId, setSellerId] = useState('');
    const [amount, setAmount] = useState('');
    const [chips, setChips] = useState('');

    const availableSellers = players.filter(p => p.id !== player.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sellerId || !amount || !chips) return;

        onRebuy(sellerId, Number(amount), Number(chips));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Rebuy for {player.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buying chips from
                        </label>
                        <select
                            value={sellerId}
                            onChange={(e) => setSellerId(e.target.value)}
                            className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select player...</option>
                            {availableSellers.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cash amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0"
                            step="any"
                            className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="100"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chips received
                        </label>
                        <input
                            type="number"
                            value={chips}
                            onChange={(e) => setChips(e.target.value)}
                            min="0"
                            step="any"
                            className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="100"
                            required
                        />
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Confirm Rebuy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
