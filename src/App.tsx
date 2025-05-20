import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Player, PokerTable } from './types';
import { TableCard } from './components/TableCard';
import { PlayerForm } from './components/PlayerForm';
import { PlayerList } from './components/PlayerList';
import { ResultsModal } from './components/ResultsModal';
import { NewTableModal } from './components/NewTableModal';
import { Plus } from 'lucide-react';

const deserializeTables = (tables: PokerTable[]): PokerTable[] => {
    return tables.map(table => ({
        ...table,
        createdAt: new Date(table.createdAt)
    }));
};

function App() {
    const [tables, setTables] = useState<PokerTable[]>(() => {
        try {
            const storedTables = localStorage.getItem('pokerTables');
            if (storedTables) {
                return deserializeTables(JSON.parse(storedTables));
            }
        } catch (error) {
            console.error('Error loading tables from localStorage:', error);
        }
        return [];
    });

    const [selectedTable, setSelectedTable] = useState<PokerTable | null>(() => {
        try {
            const storedSelectedTableId = localStorage.getItem('selectedTableId');
            if (storedSelectedTableId) {
                const tables = JSON.parse(localStorage.getItem('pokerTables') || '[]');
                const foundTable = deserializeTables(tables).find(table => table.id === storedSelectedTableId);
                return foundTable || null;
            }
        } catch (error) {
            console.error('Error loading selected table from localStorage:', error);
        }
        return null;
    });

    const [showResults, setShowResults] = useState(false);
    const [showNewTableForm, setShowNewTableForm] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('pokerTables', JSON.stringify(tables));
        } catch (error) {
            console.error('Error saving tables to localStorage:', error);
        }
    }, [tables]);

    useEffect(() => {
        if (selectedTable) {
            localStorage.setItem('selectedTableId', selectedTable.id);
        } else {
            localStorage.removeItem('selectedTableId');
        }
    }, [selectedTable]);

    const createNewTable = (name: string) => {
        const newTable: PokerTable = {
            id: uuidv4(),
            name,
            players: [],
            totalPot: 0,
            isActive: true,
            createdAt: new Date()
        };
        setTables(prev => [...prev, newTable]);
        setSelectedTable(newTable);
        setShowNewTableForm(false);
    };

    const addPlayer = (tableId: string, playerData: Omit<Player, 'id'>) => {
        const newPlayer: Player = {
            ...playerData,
            id: uuidv4()
        };

        setTables(prev => prev.map(table => {
            if (table.id === tableId) {
                return {
                    ...table,
                    players: [...table.players, newPlayer],
                    totalPot: table.totalPot + playerData.buyIn
                };
            }
            return table;
        }));

        setSelectedTable(prev => {
            if (prev && prev.id === tableId) {
                return {
                    ...prev,
                    players: [...prev.players, newPlayer],
                    totalPot: prev.totalPot + playerData.buyIn
                };
            }
            return prev;
        });
    };

    const removePlayer = (tableId: string, playerId: string) => {
        setTables(prev => prev.map(table => {
            if (table.id === tableId) {
                const player = table.players.find(p => p.id === playerId);
                return {
                    ...table,
                    players: table.players.filter(p => p.id !== playerId),
                    totalPot: table.totalPot - (player?.buyIn || 0)
                };
            }
            return table;
        }));

        setSelectedTable(prev => {
            if (prev && prev.id === tableId) {
                const player = prev.players.find(p => p.id === playerId);
                return {
                    ...prev,
                    players: prev.players.filter(p => p.id !== playerId),
                    totalPot: prev.totalPot - (player?.buyIn || 0)
                };
            }
            return prev;
        });
    };

    const updatePlayerChips = (tableId: string, playerId: string, chips: number) => {
        setTables(prev => prev.map(table => {
            if (table.id === tableId) {
                return {
                    ...table,
                    players: table.players.map(player =>
                        player.id === playerId ? { ...player, chipsAmount: chips } : player
                    )
                };
            }
            return table;
        }));

        setSelectedTable(prev => {
            if (prev && prev.id === tableId) {
                return {
                    ...prev,
                    players: prev.players.map(player =>
                        player.id === playerId ? { ...player, chipsAmount: chips } : player
                    )
                };
            }
            return prev;
        });
    };

    const finishTable = (tableId: string) => {
        setTables(prev => prev.map(table =>
            table.id === tableId ? { ...table, isActive: false } : table
        ));
        setSelectedTable(null);
        setShowResults(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {!selectedTable ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900">PokerPay</h1>
                            <button
                                onClick={() => setShowNewTableForm(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                <Plus size={20} />
                                New Game
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tables.map(table => (
                                <TableCard
                                    key={table.id}
                                    table={table}
                                    onSelect={setSelectedTable}
                                />
                            ))}
                        </div>
                        {showNewTableForm && (
                            <NewTableModal
                                onClose={() => setShowNewTableForm(false)}
                                onCreateTable={createNewTable}
                            />
                        )}
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-900">{selectedTable.name}</h1>
                            <div className="space-x-4">
                                <button
                                    onClick={() => setShowResults(true)}
                                    className="px-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Calc Results
                                </button>
                                <button
                                    onClick={() => setSelectedTable(null)}
                                    className="px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Back
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Add Player</h2>
                            <PlayerForm
                                onAddPlayer={(player) => addPlayer(selectedTable.id, player)}
                            />
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Gamblers</h2>
                            <PlayerList
                                players={selectedTable.players}
                                onRemovePlayer={(playerId) => removePlayer(selectedTable.id, playerId)}
                                onUpdateChips={(playerId, chips) => updatePlayerChips(selectedTable.id, playerId, chips)}
                            />
                        </div>
                        {showResults && (
                            <ResultsModal
                                players={selectedTable.players}
                                onClose={() => setShowResults(false)}
                                onFinish={() => finishTable(selectedTable.id)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
