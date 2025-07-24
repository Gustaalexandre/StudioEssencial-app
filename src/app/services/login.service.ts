import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.config';
import { Token } from '../models/token';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${appSettings.apiBaseUrl}/auth/login`;

  constructor(private http: HttpClient) { }

  autenticar(login: string, senha: string): Observable<Token> {
    const objetoJS = { login, senha };
    return this.http.post<Token>(this.apiUrl, objetoJS);
  }

  salvarToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage)
      localStorage.setItem('Token', token);
  }

  obterToken(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('Token') || "";
    }
    return "";
  }

  limparToken(): void {
    if (typeof window !== 'undefined' && window.localStorage)
      localStorage.removeItem('Token');
  }

  extrairDadosToken(): any | null {
    const token = this.obterToken();
    console.warn('o Token é: ' + token);
    if (!token) return null;
    try {
      const dadosToken = jwtDecode(token);
      return dadosToken;
    } catch (err) {
      return null;
    }
  }

  gerarCabecalhoHTTP() {
    const token = this.obterToken();
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
  }
}