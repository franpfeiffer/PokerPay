import { Player } from '../types';

export interface Payment {
  from: string;
  to: string;
  amount: number;
}

export const calculateOptimalPayments = (players: Player[]): Payment[] => {
  const payments: Payment[] = [];

  const balances = players.reduce((acc, player) => {
    const finalAmount = player.chipsAmount;
    const initialAmount = player.buyIn;
    acc[player.id] = finalAmount - initialAmount;
    return acc;
  }, {} as { [key: string]: number });

  const debtors = players
    .filter(p => balances[p.id] < 0)
    .map(p => ({ id: p.id, name: p.name, amount: balances[p.id] }))
    .sort((a, b) => a.amount - b.amount); 

  const creditors = players
    .filter(p => balances[p.id] > 0)
    .map(p => ({ id: p.id, name: p.name, amount: balances[p.id] }))
    .sort((a, b) => b.amount - a.amount);

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    const paymentAmount = Math.min(Math.abs(debtor.amount), creditor.amount);
    
    if (paymentAmount > 0) {
      payments.push({
        from: debtor.id,
        to: creditor.id,
        amount: paymentAmount
      });
    }

    debtor.amount += paymentAmount;
    creditor.amount -= paymentAmount;

    if (Math.abs(debtor.amount) < 0.01) debtorIndex++;
    if (Math.abs(creditor.amount) < 0.01) creditorIndex++;
  }

  return payments;
};
