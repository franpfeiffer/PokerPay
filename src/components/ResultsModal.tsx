import React, { useState } from 'react';
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
    const [showReconciliation, setShowReconciliation] = useState(false);
    const [reconciliationChoice, setReconciliationChoice] = useState<'chips' | 'cash' | null>(null);

    const totalPotPaidIn = players.reduce((sum, p) => sum + p.totalCashIn, 0);
    const totalChipsInPlay = players.reduce((sum, p) => sum + p.chipsAmount, 0);
    const imbalance = totalChipsInPlay - totalPotPaidIn;
    const hasImbalance = Math.abs(imbalance) > 0.01;

    const reconciledPlayers = players.map(player => {
        if (!hasImbalance || !reconciliationChoice) {
            return player;
        }

        if (reconciliationChoice === 'chips') {
            const ratio = totalPotPaidIn / totalChipsInPlay;
            return {
                ...player,
                chipsAmount: player.chipsAmount * ratio
            };
        } else {
            const ratio = totalChipsInPlay / totalPotPaidIn;
            return {
                ...player,
                totalCashIn: player.totalCashIn * ratio
            };
        }
    });

    const payments = calculateOptimalPayments(reconciledPlayers);
    const playerMap = reconciledPlayers.reduce((acc, player) => {
        acc[player.id] = player;
        return acc;
    }, {} as { [key: string]: Player });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Results</h2>

                {hasImbalance && !reconciliationChoice && (
                    <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                        <div className="font-bold text-yellow-800 mb-2">⚠️ Numbers Don't Match</div>
                        <div className="text-sm text-yellow-700 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>Total Cash In:</div>
                                <div className="font-mono font-bold">{formatCurrency(totalPotPaidIn)}</div>
                                <div>Total Chips:</div>
                                <div className="font-mono font-bold">{formatCurrency(totalChipsInPlay)}</div>
                                <div className="border-t pt-1">Difference:</div>
                                <div className="font-mono font-bold border-t pt-1">{formatCurrency(Math.abs(imbalance))}</div>
                            </div>

                            <div className="mt-3 pt-3 border-t">
                                <p className="font-medium mb-2">Which number is correct?</p>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setReconciliationChoice('chips')}
                                        className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-left"
                                    >
                                        <div className="font-bold">Trust the chip count</div>
                                        <div className="text-xs mt-1 opacity-90">
                                            Adjust cash amounts to match chips ({formatCurrency(totalChipsInPlay)})
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setReconciliationChoice('cash')}
                                        className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-left"
                                    >
                                        <div className="font-bold">Trust the cash records</div>
                                        <div className="text-xs mt-1 opacity-90">
                                            Adjust chip counts to match cash ({formatCurrency(totalPotPaidIn)})
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {reconciliationChoice && hasImbalance && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-500 rounded-lg">
                        <div className="text-sm text-green-700 flex items-center gap-2">
                            <span>✓</span>
                            <span>
                                Reconciled using {reconciliationChoice === 'chips' ? 'chip counts' : 'cash records'}
                            </span>
                            <button
                                onClick={() => setReconciliationChoice(null)}
                                className="ml-auto text-xs underline"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6 mb-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800">Final Balance</h3>
                        {reconciledPlayers.map(player => {
                            const finalBalance = player.chipsAmount - player.totalCashIn;
                            const originalPlayer = players.find(p => p.id === player.id);
                            const wasAdjusted = reconciliationChoice && Math.abs(
                                (reconciliationChoice === 'chips' ? player.chipsAmount : player.totalCashIn) -
                                    (reconciliationChoice === 'chips' ? originalPlayer!.chipsAmount : originalPlayer!.totalCashIn)
                            ) > 0.01;

                            return (
                                <div key={player.id} className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">{player.name}</span>
                                        {wasAdjusted && (
                                            <span className="text-xs text-yellow-600 ml-2">
                                                (adjusted)
                                            </span>
                                        )}
                                        {player.totalCashIn > player.initialBuyIn && (
                                            <span className="text-xs text-gray-500 ml-2">
                                                (Total: {formatCurrency(player.totalCashIn)})
                                            </span>
                                        )}
                                    </div>
                                    <span className={`font-semibold ${
finalBalance >= 0 ? 'text-green-600' : 'text-red-600'
}`}>
                                        {formatCurrency(finalBalance)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {(!hasImbalance || reconciliationChoice) && payments.length > 0 && (
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
                        disabled={hasImbalance && !reconciliationChoice}
                        className={`flex-1 px-4 py-2 rounded-md ${
hasImbalance && !reconciliationChoice
? 'bg-gray-300 text-gray-500 cursor-not-allowed'
: 'bg-blue-600 text-white hover:bg-blue-700'
}`}
                    >
                        End Game
                    </button>
                </div>
            </div>
        </div>
    );
};
