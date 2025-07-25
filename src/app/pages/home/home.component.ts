import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento.service';
import { Agendamento } from '../../models/agendamento';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  totalPendentes = 0;
  totalConfirmados = 0;
  totalCancelados = 0;

  constructor(private agendamentoService: AgendamentoService) {}

  ngOnInit(): void {
    this.agendamentoService.listar().subscribe({
      next: (dados) => {
        this.agendamentos = dados;
        this.contarSituacoes();
      },
      error: () => {
  console.log("Erro ao carregar dados!");
}

    });
  }

  contarSituacoes(): void {
    this.totalPendentes = this.agendamentos.filter(a => a.situacao === 'PENDENTE').length;
    this.totalConfirmados = this.agendamentos.filter(a => a.situacao === 'CONFIRMADO').length;
    this.totalCancelados = this.agendamentos.filter(a => a.situacao === 'CANCELADO').length;
  }
}
