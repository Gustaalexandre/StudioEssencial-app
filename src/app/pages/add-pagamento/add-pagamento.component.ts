import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Pagamento } from '../../models/pagamento';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'add-pagamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-pagamento.component.html',
  styleUrl: './add-pagamento.component.css'
})
export class AddPagamentoComponent {

  formGroup: FormGroup;
  mensagemErroPagamento: string;
  pagamento!: Pagamento;
  listaPagamentos: Pagamento[] = [];

  constructor(private formBuilder: FormBuilder, private service: PagamentoService, private route: ActivatedRoute, private router: Router) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', Validators.required],
      duracao: ['', Validators.required]
    });

    this.mensagemErroPagamento = "";
  }

  ngOnInit(): void {

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.pagamento = new Pagamento();
    if (id) {
      this.service.buscarPorId(id).subscribe(retorno => {
        this.pagamento = retorno;
        this.formGroup.patchValue({
          dataPagamento: this.pagamento.dataPagamento,
          dataVencimento: this.pagamento.dataVencimento,
          valor: this.pagamento.valor,
          formaPagamento: this.pagamento.formaPagamento,
          numeroParcela: this.pagamento.numeroParcela,
          agendamentoId: this.pagamento.agendamentoId
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
       this.pagamento.dataPagamento = this.formGroup.value.dataPagamento;
      this.pagamento.dataVencimento = this.formGroup.value.dataVencimento;
      this.pagamento.valor = this.formGroup.value.valor;
      this.pagamento.formaPagamento = this.formGroup.value.formaPagamento;
      this.pagamento.numeroParcela = this.formGroup.value.numeroParcela;
      this.pagamento.agendamentoId = this.formGroup.value.agendamentoId;
      this.service.salvar(this.pagamento).subscribe({
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
  verificarPagamento() {
    const pagamento = this.formGroup.get('nome')?.value;
    this.mensagemErroPagamento = "";

    this.service.verificarPagamento(pagamento).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.mensagemErroPagamento = "Pagamento já cadastrado.";
          this.formGroup.get('nome')?.setErrors({ pagamentoDuplicado: true });
        } else {
          this.mensagemErroPagamento = "";
          // Limpa o erro de PagamentoDuplicado, se existir
          this.formGroup.get('nome')?.setErrors(null);
        }
      },
      error: err => {
        this.mensagemErroPagamento = "Erro ao validar pagamento";
      }
    });
  }
}