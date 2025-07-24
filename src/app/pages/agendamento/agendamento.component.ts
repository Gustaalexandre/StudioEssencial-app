import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Agendamento } from '../../models/agendamento';
import { AgendamentoService } from '../../services/agendamento.service';
import { Procedimento } from '../../models/procedimento';
import { ProcedimentoService } from '../../services/procedimento.service';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css'
})
export class AgendamentoComponent {
  lista: Agendamento[] = [];
  listaProcedimentos: Procedimento[] = [];
  mapaProcedimentos: { [key: number]: string } = {};

  constructor(
    private service: AgendamentoService,
    private procedimentoService: ProcedimentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProcedimentos();
  }

  carregarProcedimentos(): void {
  this.procedimentoService.listar().subscribe({
    next: (procedimentos) => {
      this.listaProcedimentos = procedimentos;
      this.mapaProcedimentos = {};
      procedimentos.forEach(p => {
        if (p.id) this.mapaProcedimentos[p.id] = p.nome ?? '';
      });
      console.log('Mapa de procedimentos:', this.mapaProcedimentos);
      this.carregarLista();
    },
    error: () => {
      alert('Erro ao carregar procedimentos.');
    }
  });
}
  carregarLista(): void {
    this.service.listar().subscribe({
      next: (retornoJson) => {
        this.lista = retornoJson;
      },
      error: () => {
        alert('Erro ao carregar a lista.');
      }
    });
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir o registro?')) {
      this.service.excluir(id).subscribe({
        next: () => {
          this.carregarLista();
        },
        error: () => {
          alert('Erro ao excluir o registro. Tente novamente.');
        }
      });
    }
  }

  editar(id: number): void {
    this.router.navigate(['/add-agendamento', id]);
  }
  getMapaProcedimentosKeys(): string[] {
  return Object.keys(this.mapaProcedimentos);
}
}