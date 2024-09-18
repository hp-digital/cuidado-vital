import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ComboDTO } from '../models/ComboDTO';
import { environment } from '../../environments/environment';
import { ListadoBusquedaAtencionDTO } from '../models/ListadoBusquedaAtencionDTO';
import { HistoriaCuidadoDTO } from '../models/historia-cuidado';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {

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

  ObtenerServicioConsulta(criterioBusqueda: string) {
    return this.http.get<ListadoBusquedaAtencionDTO[]>(`${API_URL}HistoriaClinica/ObtenerListadoHistoriaAtencion?${criterioBusqueda}`);
  }
  ObtenerHistoriaClinica(id: number) {
    return this.http.get<HistoriaCuidadoDTO>(`${API_URL}HistoriaClinicaExterna/ObtenerHistoriaId?id=${id}`)
      .pipe(catchError(this.handleError));
  }
  
  public ActualizarHistoria(data: HistoriaCuidadoDTO) {
    const url = `${API_URL}HistoriaClinicaExterna/HistoriaClinica`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      timeout(this.nTimeout),
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }
}
