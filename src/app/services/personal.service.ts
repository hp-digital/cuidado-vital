import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MedicoDTO } from '@models/MedicoDTO';
import { ListadoMedicoDTO } from '../models/ListadoMedicoDTO';
import { catchError, retry,timeout } from 'rxjs/operators';

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

  public Insertar(data: MedicoDTO){
    const url = `${API_URL}Personal/Insertar`;
    return  this.http.post(url, data, { headers: this.headers }).pipe(
      timeout(this.nTimeout),
      retry(this.nRetry), 
      catchError(this.handleError) 
    );
  }
  ObtenerListadoMedico(): Observable<ListadoMedicoDTO[]>{
    return this.http.get<ListadoMedicoDTO[]>(`${API_URL}Medico/ObtenerListado`)

  }
}