import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ListadoMedicoDTO } from '../models/ListadoMedicoDTO';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  public nTimeout: number = 20000;
  public nRetry: number = 0;

  private handleError(error: HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
      console.error('Error : ', error.error.message);
    }else{
      console.error('Codigo de error, ' + error.status);
    }
    return throwError(() => error.error);
  };

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  constructor(private http: HttpClient) { }

  ObtenerListadoMedico(): Observable<ListadoMedicoDTO[]>{
    return this.http.get<ListadoMedicoDTO[]>(`${API_URL}Medico/ObtenerListado`)
  }
}
