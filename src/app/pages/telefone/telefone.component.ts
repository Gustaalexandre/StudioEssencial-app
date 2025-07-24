import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { TelefoneService } from '../../services/telefone.service';
import { Telefone } from '../../models/telefone';

@Component({
  selector: 'app-telefone',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './telefone.component.html',
  styleUrl: './telefone.component.css'
})

export class TelefoneComponent {
  lista: Telefone[] = [];

  constructor(private service: TelefoneService, private route: ActivatedRoute, private router: Router) {
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
    this.router.navigate(['/add-telefone', id]);
  }
}