import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Procedimento } from '../../models/procedimento';
import { ProcedimentoService } from '../../services/procedimento.service';

@Component({
  selector: 'add-procedimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-procedimento.component.html',
  styleUrl: './add-procedimento.component.css'
})
export class AddProcedimentoComponent {

  formGroup: FormGroup;
  mensagemErroProcedimento: string;
  procedimento!: Procedimento;
  listaProcedimentos: Procedimento[] = [];

  constructor(private formBuilder: FormBuilder, private service: ProcedimentoService, private route: ActivatedRoute, private router: Router) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', Validators.required],
      duracao: ['', Validators.required]
    });

    this.mensagemErroProcedimento = "";
  }

  ngOnInit(): void {

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.procedimento = new Procedimento();
    if (id) {     
      this.service.buscarPorId(id).subscribe(retorno => {     
        this.procedimento = retorno;   
        this.formGroup.patchValue({
          nome: this.procedimento.nome,
          descricao: this.procedimento.descricao,
          preco: this.procedimento.preco,
          duracao: this.procedimento.duracao
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
       this.procedimento.nome = this.formGroup.value.nome;
      this.procedimento.descricao = this.formGroup.value.descricao;
      this.procedimento.preco = this.formGroup.value.preco;
      this.procedimento.duracao = this.formGroup.value.duracao;
      this.service.salvar(this.procedimento).subscribe({
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
  verificarProcedimento() {
    const procedimento = this.formGroup.get('nome')?.value;
    this.mensagemErroProcedimento = "";

    this.service.verificarProcedimento(procedimento).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.mensagemErroProcedimento = "Procedimento já cadastrado.";
          this.formGroup.get('nome')?.setErrors({ procedimentoDuplicado: true });
        } else {
          this.mensagemErroProcedimento = "";
          // Limpa o erro de ProcedimentoDuplicado, se existir
          this.formGroup.get('nome')?.setErrors(null);
        }
      },
      error: err => {
        this.mensagemErroProcedimento = "Erro ao validar procedimento";
      }
    });
  }
}