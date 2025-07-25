import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Pagamento } from '../../models/pagamento';
import { PagamentoService } from '../../services/pagamento.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'add-pagamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './add-pagamento.component.html',
  styleUrl: './add-pagamento.component.css'
})
export class AddPagamentoComponent implements OnInit {

  formGroup: FormGroup;
  mensagemErroPagamento: string;
  pagamento!: Pagamento;
  listaPagamentos: Pagamento[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: PagamentoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      dataPagamento: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      valor: ['', Validators.required],
      formaPagamento: ['', Validators.required],
      numeroParcela: ['', Validators.required],
      agendamentoId: ['', Validators.required]
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
    console.log('Formulário enviado:', this.formGroup.value); // Para debug

    if (this.formGroup.valid) {
      this.pagamento.dataPagamento = this.formGroup.value.dataPagamento;
      this.pagamento.dataVencimento = this.formGroup.value.dataVencimento;
      this.pagamento.valor = this.formGroup.value.valor;
      this.pagamento.formaPagamento = this.formGroup.value.formaPagamento;
      this.pagamento.numeroParcela = this.formGroup.value.numeroParcela;
      this.pagamento.agendamentoId = this.formGroup.value.agendamentoId;

      this.service.salvar(this.pagamento).subscribe({
        next: () => {
          this.snackBar.open('Registro salvo com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.formGroup.reset();
          this.router.navigate(['/app-pagamento']);
        },
        error: () => {
          this.snackBar.open('Erro ao salvar o registro. Tente novamente.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }

  verificarPagamento() {
    const pagamento = this.formGroup.get('formaPagamento')?.value;
    this.mensagemErroPagamento = "";

    this.service.verificarPagamento(pagamento).subscribe({
      next: (existe: boolean) => {
        if (existe) {
          this.mensagemErroPagamento = "Pagamento já cadastrado.";
          this.formGroup.get('formaPagamento')?.setErrors({ pagamentoDuplicado: true });
        } else {
          this.mensagemErroPagamento = "";
          this.formGroup.get('formaPagamento')?.setErrors(null);
        }
      },
      error: () => {
        this.mensagemErroPagamento = "Erro ao validar pagamento";
      }
    });
  }
}
