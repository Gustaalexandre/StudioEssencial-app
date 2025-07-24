import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
// import { LoginService } from '../../services/login.service';

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

    // { descricao: 'Telefones', rota: '/app-telefone', niveis: ['FUNCIONARIO'] },

    // { descricao: 'Produtos', rota: '/produtos', niveis: ['NIVEL1', 'NIVEL2'] },
    // { descricao: 'Usuários', rota: '/usuarios', niveis: ['NIVEL1'] },
    // { descricao: 'Pedidos', rota: '/pedidos', niveis: ['NIVEL2', 'NIVEL3'] },
  ];

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {

    const dadosToken = this.loginService.extrairDadosToken();
    // console.log('Token decodificado:', dadosToken);
    if (dadosToken && dadosToken.roles) {
      // Remove "ROLE_" com a empressão regular /^ROLE_/
      this.nivel = dadosToken.roles.replace(/^ROLE_/, '');
    } else {
      console.warn('Não foi possível determinar o nível do usuário a partir do token.');
    }
  }

  logout() {
    this.loginService.limparToken();
    window.location.href = "";
  }
}