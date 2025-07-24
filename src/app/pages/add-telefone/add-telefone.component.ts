import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Telefone } from '../../models/telefone';
import { TelefoneService } from '../../services/telefone.service';

@Component({
  selector: 'add-telefone',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-telefone.component.html',
  styleUrl: './add-telefone.component.css'
})
export class AddTelefoneComponent {

  formGroup: FormGroup;
  mensagemErroTelefone: string;
  telefone!: Telefone;
  listaTelefones: Telefone[] = [];

  constructor(private formBuilder: FormBuilder, private service: TelefoneService, private route: ActivatedRoute, private router: Router) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', Validators.required],
      duracao: ['', Validators.required]
    });

    this.mensagemErroTelefone = "";
  }

  ngOnInit(): void {

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.telefone = new Telefone();
    if (id) {
      this.service.buscarPorId(id).subscribe(retorno => {
        this.telefone = retorno;
        this.formGroup.patchValue({
          pessoaId: this.telefone.pessoaId,
          telefone: this.telefone.telefone,
        });
      });
    }
  }

  onSubmit(): void {

    // if (this.formGroup.valid) {

    //   this.service.salvar(this.formGroup.value).subscribe({
    //     next: () => {
    //       alert('Procedimento criado com sucesso!');
    //       this.formGroup.reset();
    //       this.router.navigate(['/home']);
    //     },
    //     error: () => {
    //       alert('Erro ao criar procedimento. Tente novamente.');
    //     }
    //   });
    // }

     if (this.formGroup.valid) {
       this.telefone.pessoaId = this.formGroup.value.pessoaId;
      this.telefone.telefone = this.formGroup.value.telefone;
      this.service.salvar(this.telefone).subscribe({
        next: () => {
          alert('Registro salvo com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/app-procedimento']);
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });
    }
  }

  //não ta usando token.
  verificarTelefone() {
    const telefone = this.formGroup.get('nome')?.value;
    this.mensagemErroTelefone = "";

    this.service.verificarTelefone(telefone).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.mensagemErroTelefone = "Telefone já cadastrado.";
          this.formGroup.get('nome')?.setErrors({ telefoneDuplicado: true });
        } else {
          this.mensagemErroTelefone = "";
          // Limpa o erro de TelefoneDuplicado, se existir
          this.formGroup.get('nome')?.setErrors(null);
        }
      },
      error: err => {
        this.mensagemErroTelefone = "Erro ao validar telefone";
      }
    });
  }
}