import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';
import { Telefone } from '../models/telefone';
import { Token } from '../models/token';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TelefoneService {

  private apiUrl = `${appSettings.apiBaseUrl}/telefones`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Telefone[]> {
    return this.http.get<Telefone[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(telefone: Telefone): Observable<Telefone> {
    if (telefone.id) {
      return this.http.put<Telefone>(`${this.apiUrl}/${telefone.id}`, telefone, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Telefone>(this.apiUrl, telefone, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Telefone> {
    return this.http.get<Telefone>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  verificarTelefone(telefone: string): Observable<boolean> {
    const url = `${this.apiUrl}/existe?nomeTelefone=${encodeURIComponent(telefone)}`;
    return this.http.get<boolean>(url, this.loginService.gerarCabecalhoHTTP());
  }
}