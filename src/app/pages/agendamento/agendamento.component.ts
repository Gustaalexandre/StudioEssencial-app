import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Agendamento } from '../../models/agendamento';
import { AgendamentoService } from '../../services/agendamento.service';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.css'
})

export class AgendamentoComponent {
  lista: Agendamento[] = [];

  constructor(private service: AgendamentoService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.carregarLista();
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
}
