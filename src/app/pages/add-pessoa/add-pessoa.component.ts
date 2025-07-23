import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Router, ActivatedRoute, RouterModule, withDebugTracing } from '@angular/router';
import { PessoaService } from '../../services/pessoa.service';
import { Pessoa } from '../../models/pessoa';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'add-pessoa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-pessoa.component.html',
  styleUrl: './add-pessoa.component.css'
})
export class AddPessoaComponent {

  formGroup: FormGroup;
  mensagemErroLogin: string;
  listaPessoas: Pessoa[] = [];

  constructor(private formBuilder: FormBuilder, private service: UsuarioService, private route: ActivatedRoute, private router: Router, private pessoaService: PessoaService) {


    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      endereco: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', Validators.required],
      nivelAcesso: ['', Validators.required],
    });

    this.mensagemErroLogin = "";
  }

  ngOnInit(): void {
    this.carregarListaPessoa();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      // Extrair dados da pessoa
      const pessoaData = new Pessoa();

      pessoaData.nome = this.formGroup.get('nome')?.value;
      pessoaData.sexo = this.formGroup.get('sexo')?.value;
      pessoaData.endereco = this.formGroup.get('endereco')?.value;


      this.pessoaService.salvar(pessoaData).subscribe({
        next: (pessoaSalva: Pessoa) => {
          // Após salvar a pessoa, salvar o usuário com o id da pessoa
          const usuarioData = new Usuario();

          usuarioData.login = this.formGroup.get('login')?.value;
          usuarioData.senha = this.formGroup.get('senha')?.value;
          usuarioData.nivelAcesso = this.formGroup.get('nivelAcesso')?.value;
          usuarioData.pessoaId = pessoaSalva.id; // Aqui é o vínculo


          this.service.salvar(usuarioData).subscribe({
            next: () => {
              alert('Usuário criado com sucesso!');
              this.formGroup.reset();
              this.router.navigate(['']);
              // window.location.href='/home';
            },
            error: () => {
              alert('Erro ao criar usuário.');
            }
          });
        },
        error: () => {
          alert('Erro ao salvar pessoa.');
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
