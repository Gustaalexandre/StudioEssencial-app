import { Pessoa } from "./pessoa";

export class Agendamento {
    id!: number;
    cliente?: Partial<Pessoa>;    // Alterado para Partial<Pessoa> para aceitar objeto parcial
    funcionario?: Partial<Pessoa>; // Alterado para Partial<Pessoa> para aceitar objeto parcial
    procedimentoId?: number;
    data?: Date;
    situacao?: string;
    numeroParcelas?: number;
    valorTotal?: number;

}
