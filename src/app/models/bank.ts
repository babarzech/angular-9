export class Bank {
    public bankName: string;
    public accountTitle: string;
    public accountNumber: string;
    public id: number;
    public status: BankStatus;
}

export enum BankStatus {
    Pending, Verified, Rejected
}
