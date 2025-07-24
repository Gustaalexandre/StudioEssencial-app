import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private apiUrl = `${appSettings.apiBaseUrl}/pessoas`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(pessoa: Pessoa): Observable<Pessoa> {
    if (pessoa.id) {
      return this.http.put<Pessoa>(`${this.apiUrl}/${pessoa.id}`, pessoa, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Pessoa>(this.apiUrl, pessoa, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }
}