import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Token } from '../../models/token';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formGroup: FormGroup;
  token: Token;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });

    this.token = new Token();
  }

  ngOnInit(): void {
    this.loginService.limparToken();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      this.loginService.autenticar(formValue.login, formValue.senha).subscribe({
        next: (resposta) => {
          this.token = resposta;
          this.loginService.salvarToken(this.token.accessToken);

          // Decodifica o token para pegar o nível de acesso
          const dadosToken = this.loginService.extrairDadosToken();
          if (dadosToken && dadosToken.roles && dadosToken.roles.includes('CLIENTE')) {
            // this.router.navigate(['/home-cliente']);
            window.location.href = '/home-cliente';
          } else {
            // this.router.navigate(['/home']);
            window.location.href = '/home';
          }
        },
        error: (err) => {
          alert('Login ou senha inválidos.');
        }
      });
    }
  }
}