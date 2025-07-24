import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  nivel = 'NIVEL0';

  menu = [
    { descricao: 'Procedimentos', rota: '/app-procedimento', niveis: ['FUNCIONARIO'] },
    { descricao: 'Agendamentos', rota: '/app-agendamento', niveis: ['FUNCIONARIO', 'CLIENTE'] },
    { descricao: 'Pagamentos', rota: '/app-pagamento', niveis: ['FUNCIONARIO'] },
    // { descricao: 'Telefones', rota: '/app-telefone', niveis: ['FUNCIONARIO'] },
    // { descricao: 'Produtos', rota: '/produtos', niveis: ['NIVEL1', 'NIVEL2'] },
    // { descricao: 'Usuários', rota: '/usuarios', niveis: ['NIVEL1'] },
    // { descricao: 'Pedidos', rota: '/pedidos', niveis: ['NIVEL2', 'NIVEL3'] },
  ];

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    const dadosToken = this.loginService.extrairDadosToken();
    if (dadosToken && dadosToken.roles) {
      // Remove "ROLE_" se existir
      this.nivel = Array.isArray(dadosToken.roles)
        ? dadosToken.roles[0].replace(/^ROLE_/, '')
        : dadosToken.roles.replace(/^ROLE_/, '');
    } else {
      console.warn('Não foi possível determinar o nível do usuário a partir do token.');
    }
  }

  irParaHome() {
    if (this.nivel === 'CLIENTE') {
      this.router.navigate(['/home-cliente']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    this.loginService.limparToken();
    window.location.href = "";
  }
}