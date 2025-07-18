import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PessoaService } from '../../services/pessoa.service';
import { Pessoa } from '../../models/pessoa';

@Component({
  selector: 'add-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-usuario.component.html',
  styleUrl: './add-usuario.component.css'
})
export class AddUsuarioComponent {

  formGroup: FormGroup;
  mensagemErroLogin: string;
  listaPessoas: Pessoa[] = [];

  constructor(private formBuilder: FormBuilder, private service: UsuarioService, private route: ActivatedRoute, private router: Router, private pessoaService: PessoaService) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      login: ['', Validators.required],
      senha: ['', Validators.required],
      nivelAcesso: ['', Validators.required],
      pessoaId: ['', Validators.required]
    });

    this.mensagemErroLogin = "";
  }

  ngOnInit(): void {
    this.carregarListaPessoa();
  }

  onSubmit(): void {

    if (this.formGroup.valid) {

      this.service.salvar(this.formGroup.value).subscribe({
        next: () => {
          alert('Usuario criado com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/home']);
        },
        error: () => {
          alert('Erro ao criar usuario. Tente novamente.');
        }
      });
      
    }
  }


  verificarLogin() {
    const login = this.formGroup.get('login')?.value;
    this.mensagemErroLogin = "";

    this.service.verificarLogin(login).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.mensagemErroLogin = "Login já cadastrado.";
          this.formGroup.get('login')?.setErrors({ loginDuplicado: true });
        } else {
          this.mensagemErroLogin = "";
          // Limpa o erro de loginDuplicado, se existir
          this.formGroup.get('login')?.setErrors(null);
        }
      },
      error: err => {
        this.mensagemErroLogin = "Erro ao validar o login";
      }
    });
  }

   carregarListaPessoa(): void {
    this.pessoaService.listar().subscribe({
      next: (retornoJson) => {
        this.listaPessoas = retornoJson;
      },
      error: () => {
        alert('Erro ao carregar a lista de pessoas.');
      }
    });
  }


}
