import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { PagamentoService } from '../../services/pagamento.service';
import { Pagamento } from '../../models/pagamento';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagamento.component.html',
  styleUrl: './pagamento.component.css'
})

export class PagamentoComponent {
  lista: Pagamento[] = [];

  constructor(private service: PagamentoService, private route: ActivatedRoute, private router: Router) {
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
    this.router.navigate(['/add-pagamento', id]);
  }
}