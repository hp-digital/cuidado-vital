import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ComboDTO } from '../models/ComboDTO';
import { environment } from '../../environments/environment';
import { ServicioDTO } from '../models/ServicioDTO';
import { ListadoBusquedaServicioDTO } from '../models/ListadoBusquedaServicioDTO';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ServicioServiceService {

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

  ObtenerEspecialidad(): Observable<ComboDTO[]>{
    return this.http.get<ComboDTO[]>(`${API_URL}EspecialidadMedica/ObtenerCombo`)
  }
  ObtenerTipoAtencion(): Observable<ComboDTO[]>{
    return this.http.get<ComboDTO[]>(`${API_URL}TipoAtencion/ObtenerCombo`)
  }
  ObtenerMedicoCombo(): Observable<ComboDTO[]>{
    return this.http.get<ComboDTO[]>(`${API_URL}TipoDocumento/ObtenerCombo`)
  }

  public Registrar(data: ServicioDTO) {
    const url = `${API_URL}Servicio/Registrar`;
    return this.http.post(url, data, { headers: this.headers }).pipe(
      timeout(this.nTimeout),
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  ObtenerServicioConsulta(criterioBusqueda: string) {
    return this.http.get<ListadoBusquedaServicioDTO[]>(`${API_URL}Servicio/ObtenerListadoServicioBusqueda?${criterioBusqueda}`);
  }
}
