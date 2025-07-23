import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { ProcedimentoService } from '../../services/procedimento.service';
import { Procedimento } from '../../models/procedimento';

@Component({
  selector: 'app-procedimento',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './procedimento.component.html',
  styleUrl: './procedimento.component.css'
})

export class ProcedimentoComponent {
  lista: Procedimento[] = [];

  constructor(private service: ProcedimentoService, private route: ActivatedRoute, private router: Router) {
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
    this.router.navigate(['/add-procedimento', id]);    
  }
}
