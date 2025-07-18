import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AddUsuarioComponent } from './pages/add-usuario/add-usuario.component';
import { AddPessoaComponent } from './pages/add-pessoa/add-pessoa.component';



export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: LoginComponent },
  { path: 'add-usuario', component: AddUsuarioComponent },
  { path: 'add-pessoa', component: AddPessoaComponent }

];
