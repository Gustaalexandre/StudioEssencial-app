import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../app.config';
import { LoginService } from './login.service';
import { Agendamento } from '../models/agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private apiUrl = `${appSettings.apiBaseUrl}/agendamentos`;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  listar(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl, this.loginService.gerarCabecalhoHTTP());
  }

  salvar(agendamento: Agendamento): Observable<Agendamento> {
    if (agendamento.id) {
      return this.http.put<Agendamento>(`${this.apiUrl}/${agendamento.id}`, agendamento, this.loginService.gerarCabecalhoHTTP());
    } else {
      return this.http.post<Agendamento>(this.apiUrl, agendamento, this.loginService.gerarCabecalhoHTTP());
    }
  }

  buscarPorId(id: number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.loginService.gerarCabecalhoHTTP());
  }

}
