import { PER_MINUTE_RATE } from "../(lib)/constants";

export const calcCdrTarif = ({ billsec, freeInterval }: { billsec: number, freeInterval: number }) => {
    if (billsec <= freeInterval) {
        return '$0.00';
    }
    const remainingDuration = billsec - 3;
    const minutes = Math.ceil(remainingDuration / 60);
    const costPerMinute = PER_MINUTE_RATE;
    const totalCost = minutes * costPerMinute;
    return `$${totalCost.toFixed(2)}`
}