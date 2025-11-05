import React, { useState } from 'react';
import { Player } from '../types';
import { Trash2 } from 'lucide-react';

interface SellerEntry {
    sellerId: string;
    chips: number;
}

interface RebuyModalProps {
    player: Player;
    players: Player[];
    onClose: () => void;
    onRebuy: (sellers: { sellerId: string; chips: number }[], totalAmount: number) => void;
}

export const RebuyModal: React.FC<RebuyModalProps> = ({
    player,
    players,
    onClose,
    onRebuy
}) => {
    const [sellers, setSellers] = useState<SellerEntry[]>([{ sellerId: '', chips: 0 }]);
    const [totalAmount, setTotalAmount] = useState('');

    const availableSellers = players.filter(p => p.id !== player.id);

    const addSeller = () => {
        setSellers([...sellers, { sellerId: '', chips: 0 }]);
    };

    const removeSeller = (index: number) => {
        if (sellers.length > 1) {
            setSellers(sellers.filter((_, i) => i !== index));
        }
    };

    const updateSeller = (index: number, field: keyof SellerEntry, value: string | number) => {
        const newSellers = [...sellers];
        newSellers[index] = { ...newSellers[index], [field]: value };
        setSellers(newSellers);
    };

    const totalChips = sellers.reduce((sum, s) => sum + (Number(s.chips) || 0), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!totalAmount || totalChips === 0) return;

        const validSellers = sellers.filter(s => s.sellerId && s.chips > 0);
        if (validSellers.length === 0) return;

        onRebuy(validSellers, Number(totalAmount));
    };

    const getAvailableChips = (sellerId: string): number => {
        const seller = players.find(p => p.id === sellerId);
        return seller?.chipsAmount || 0;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Rebuy for {player.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total cash amount
                        </label>
                        <input
                            type="number"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            min="0"
                            step="any"
                            className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Total cash paying"
                            required
                        />
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Buying chips from
                            </label>
                            <button
                                type="button"
                                onClick={addSeller}
                                className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                            >
                                + Add Seller
                            </button>
                        </div>

                        <div className="space-y-3">
                            {sellers.map((seller, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Seller {index + 1}</span>
                                        {sellers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSeller(index)}
                                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <select
                                        value={seller.sellerId}
                                        onChange={(e) => updateSeller(index, 'sellerId', e.target.value)}
                                        className="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select player...</option>
                                        {availableSellers.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.chipsAmount} chips available)
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={seller.chips || ''}
                                            onChange={(e) => updateSeller(index, 'chips', Number(e.target.value))}
                                            min="0"
                                            max={seller.sellerId ? getAvailableChips(seller.sellerId) : undefined}
                                            step="any"
                                            className="flex-1 p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Chips from this seller"
                                            required
                                        />
                                        {seller.sellerId && (
                                            <span className="text-xs text-gray-500">
                                                / {getAvailableChips(seller.sellerId)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-semibold text-blue-900">
                            Total chips: {totalChips}
                        </div>
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
