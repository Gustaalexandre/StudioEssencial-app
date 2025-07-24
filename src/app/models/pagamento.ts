import { Agendamento } from "./agendamento";

export class Pagamento {
    id!: number;
    dataPagamento!: Date;
    dataVencimento!: Date;
    valor!: number;
    formaPagamento!: string;
    numeroParcela!: number;
    agendamentoId!: number;
}