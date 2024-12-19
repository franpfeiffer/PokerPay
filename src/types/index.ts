export interface Player {
    id: string;
    name: string;
    buyIn: number;
    chipsAmount: number;
}

export interface PokerTable {
    id: string;
    name: string;
    players: Player[];
    totalPot: number;
    isActive: boolean;
    createdAt: Date;
}
