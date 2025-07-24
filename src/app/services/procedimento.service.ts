import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';
import { Procedimento } from '../models/procedimento';
import { Token } from '../models/token';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ProcedimentoService {

  private apiUrl = `${appSettings.apiBaseUrl}/procedimentos`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Procedimento[]> {
    return this.http.get<Procedimento[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(procedimento: Procedimento): Observable<Procedimento> {
    if (procedimento.id) {
      return this.http.put<Procedimento>(`${this.apiUrl}/${procedimento.id}`, procedimento, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Procedimento>(this.apiUrl, procedimento, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Procedimento> {
    return this.http.get<Procedimento>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  verificarProcedimento(procedimento: string): Observable<boolean> {
    const url = `${this.apiUrl}/existe?nomeProcedimento=${encodeURIComponent(procedimento)}`;
    return this.http.get<boolean>(url, this.loginService.gerarCabecalhoHTTP());
  }
}