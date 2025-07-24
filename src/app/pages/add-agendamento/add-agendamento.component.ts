import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { Procedimento } from '../../models/procedimento';
import { ProcedimentoService } from '../../services/procedimento.service';
import { Agendamento } from '../../models/agendamento';
import { Pessoa } from '../../models/pessoa';
import { PessoaService } from '../../services/pessoa.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'add-agendamento',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './add-agendamento.component.html',
  styleUrl: './add-agendamento.component.css'
})
export class AddAgendamentoComponent {

  formGroup: FormGroup;
  listaProcedimentos: Procedimento[] = [];
  // listaClientes: Pessoa[] = [];
  listaClientes: Pessoa[] = [];
  listaFuncionarios: Pessoa[] = [];
  agendamento!: Agendamento;

  constructor(private formBuilder: FormBuilder, private agendamentoService: AgendamentoService, private route: ActivatedRoute, private router: Router, private procedimentoService: ProcedimentoService, private pessoaService: PessoaService, private usuarioService: UsuarioService) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      clienteId: ['', Validators.required],
      funcionarioId: ['', Validators.required],
      procedimentoId: ['', Validators.required],
      data: ['', Validators.required],
      situacao: ['', Validators.required],
      numeroParcelas: ['', Validators.required],
      valorTotal: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarListaProcedimento();
    this.carregarListaClientes();
    this.carregarListaFuncionarios();

    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.agendamento = new Agendamento();
    if (id) {
      this.agendamentoService.buscarPorId(id).subscribe(retorno => {
        this.agendamento = retorno;
        // let procedimentoSelecionado = this.listaProcedimentos.find(temp => temp.id === retorno.procedimento!.id);
        this.formGroup.patchValue({
          clienteId: this.agendamento.cliente?.id ?? null,      // usa ?.id para pegar id do cliente
          funcionarioId: this.agendamento.funcionario?.id ?? null,  // idem para funcionário
          procedimentoId: this.agendamento.procedimentoId ?? null,
          data: this.agendamento.data ?? null,
          situacao: this.agendamento.situacao ?? null,
          numeroParcelas: this.agendamento.numeroParcelas ?? null,
          valorTotal: this.agendamento.valorTotal ?? null
        });
      });
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {

      const formValues = this.formGroup.value;

      // Monta o objeto Agendamento para enviar ao backend
      this.agendamento = {
        id: formValues.id,
        cliente: { id: formValues.clienteId },      // apenas id do usuario cliente
        funcionario: { id: formValues.funcionarioId }, // apenas id do usuario funcionário
        procedimentoId: formValues.procedimentoId,
        data: formValues.data,
        situacao: formValues.situacao,
        numeroParcelas: formValues.numeroParcelas,
        valorTotal: formValues.valorTotal
      };

      this.agendamentoService.salvar(this.agendamento).subscribe({
        next: () => {
          alert('Registro salvo com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/app-agendamento']);
        },
        error: () => {
          alert('Erro ao salvar o registro. Tente novamente.');
        }
      });
    }
  }

  carregarListaProcedimento(): void {
    this.procedimentoService.listar().subscribe({
      next: (retornoJson) => {
        this.listaProcedimentos = retornoJson;
      },
      error: () => {
        alert('Erro ao carregar a lista de Procedimentos.');
      }
    });
  }


  carregarListaClientes(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        const clientes = usuarios.filter(u => u.nivelAcesso === 'CLIENTE');

        this.pessoaService.listar().subscribe({
          next: (pessoas) => {
            // Filtra pessoas que correspondem aos clientes pelo pessoaId
            this.listaClientes = pessoas.filter(p =>
              clientes.some(c => c.pessoaId === p.id)
            );
          },
          error: () => alert('Erro ao carregar pessoas.')
        });
      },
      error: () => alert('Erro ao carregar usuários.')
    });
  }

  carregarListaFuncionarios(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        const funcionarios = usuarios.filter(u => u.nivelAcesso === 'FUNCIONARIO');

        this.pessoaService.listar().subscribe({
          next: (pessoas) => {
            // Filtra pessoas que correspondem aos funcionários pelo pessoaId
            this.listaFuncionarios = pessoas.filter(p =>
              funcionarios.some(f => f.pessoaId === p.id)
            );
          },
          error: () => alert('Erro ao carregar pessoas.')
        });
      },
      error: () => alert('Erro ao carregar usuários.')
    });
  }

  

}
