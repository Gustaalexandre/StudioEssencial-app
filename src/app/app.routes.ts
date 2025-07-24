import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AddUsuarioComponent } from './pages/add-usuario/add-usuario.component';
import { AddPessoaComponent } from './pages/add-pessoa/add-pessoa.component';
import { AddProcedimentoComponent } from './pages/add-procedimento/add-procedimento.component';
import { ProcedimentoComponent } from './pages/procedimento/procedimento.component';
import { AddAgendamentoComponent } from './pages/add-agendamento/add-agendamento.component';
import { AgendamentoComponent } from './pages/agendamento/agendamento.component';
import { TelefoneComponent } from './pages/telefone/telefone.component';
import { AddTelefoneComponent } from './pages/add-telefone/add-telefone.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: LoginComponent },
  { path: 'add-usuario', component: AddUsuarioComponent },
  { path: 'add-pessoa', component: AddPessoaComponent },
  { path: 'app-procedimento', component: ProcedimentoComponent },
  { path: 'add-procedimento', component: AddProcedimentoComponent },
  { path: 'add-procedimento/:id', component: AddProcedimentoComponent },
  { path: 'app-agendamento', component: AgendamentoComponent},
  { path: 'add-agendamento', component: AddAgendamentoComponent},
  { path: 'add-agendamento/:id', component: AddAgendamentoComponent },
  // { path: 'app-telefone', component: TelefoneComponent },
  // { path: 'add-telefone', component: AddTelefoneComponent },
  // { path: 'add-telefone/:id', component: AddTelefoneComponent },
];