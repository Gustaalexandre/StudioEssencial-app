import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';
import { Pagamento } from '../models/pagamento';
import { Token } from '../models/token';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private apiUrl = `${appSettings.apiBaseUrl}/pagamentos`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(pagamento: Pagamento): Observable<Pagamento> {
    if (pagamento.id) {
      return this.http.put<Pagamento>(`${this.apiUrl}/${pagamento.id}`, pagamento, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Pagamento>(this.apiUrl, pagamento, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  verificarPagamento(formaPagamento: string): Observable<boolean> {
    const url = `${this.apiUrl}/existe?formaPagamento=${encodeURIComponent(formaPagamento)}`;
    return this.http.get<boolean>(url, this.loginService.gerarCabecalhoHTTP());
  }
}