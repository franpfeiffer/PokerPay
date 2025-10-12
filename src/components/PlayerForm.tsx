import React, { useState } from 'react';
import { Player } from '../types';

interface PlayerFormProps {
    onAddPlayer: (player: Omit<Player, 'id' | 'totalCashIn' | 'transactions'>) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
    const [name, setName] = useState('');
    const [initialBuyIn, setInitialBuyIn] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !initialBuyIn) return;

        onAddPlayer({
            name,
            initialBuyIn: Number(initialBuyIn),
            chipsAmount: Number(initialBuyIn)
        });

        setName('');
        setInitialBuyIn('');
    };

    function firstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name of the gambler
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(firstLetter(e.target.value))}
                    className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="initialBuyIn" className="block text-sm font-medium text-gray-700">
                    Buy-in
                </label>
                <input
                    type="number"
                    id="initialBuyIn"
                    value={initialBuyIn}
                    onChange={(e) => setInitialBuyIn(e.target.value)}
                    min="0"
                    step="any"
                    className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Add Gambler
            </button>
        </form>
    );
};
