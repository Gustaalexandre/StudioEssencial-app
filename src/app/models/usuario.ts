import { Pessoa } from "./pessoa";

export class Usuario {
    id!: number;
    login?: string;
    senha?: string;
    nivelAcesso?: string;
    pessoa?: Pessoa;
}
