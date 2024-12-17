export const calculatePayout = (players: Player[]): { [key: string]: number } => {
    const totalBuyIn = players.reduce((sum, player) => sum + player.buyIn, 0);
    const payouts: { [key: string]: number } = {};

    players.forEach(player => {
        const playerEquity = (player.chipsAmount / totalBuyIn) * totalBuyIn;
        const netChange = playerEquity - player.buyIn;
        payouts[player.id] = netChange;
    });

    return payouts;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
};
