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
  mensagemErroLogin: string;
  listaProcedimentos: Procedimento[] = [];

  constructor(private formBuilder: FormBuilder, private service: ProcedimentoService, private route: ActivatedRoute, private router: Router) {

    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', Validators.required],
      duracao: ['', Validators.required]
    });

    this.mensagemErroLogin = "";
  }

  ngOnInit(): void {
  }

  onSubmit(): void {

    if (this.formGroup.valid) {

      this.service.salvar(this.formGroup.value).subscribe({
        next: () => {
          alert('Procedimento criado com sucesso!');
          this.formGroup.reset();
          this.router.navigate(['/home']);
        },
        error: () => {
          alert('Erro ao criar procedimento. Tente novamente.');
        }
      });
      
    }
  }


  verificarProcedimento() {
    const login = this.formGroup.get('procedimento')?.value;
    this.mensagemErroLogin = "";

    this.service.verificarProcedimento(login).subscribe({
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
        this.mensagemErroLogin = "Erro ao validar procedimento";
      }
    });
  }

}
