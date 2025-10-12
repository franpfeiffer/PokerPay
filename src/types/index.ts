export interface Transaction {
    id: string;
    timestamp: Date;
    from: string;
    to: string;
    amount: number;
    chips: number;
}

export interface Player {
    id: string;
    name: string;
    initialBuyIn: number;
    totalCashIn: number;
    chipsAmount: number;
    transactions: Transaction[];
}

export interface PokerTable {
    id: string;
    name: string;
    players: Player[];
    totalPot: number;
    isActive: boolean;
    createdAt: Date;
}
