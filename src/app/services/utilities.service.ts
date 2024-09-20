import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConsultaDoctoraliaDTO } from '@models/cuerpo-envio-doctoralia';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
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

  ObtenerDirectorioMedico(consulta: ConsultaDoctoraliaDTO) {
    const url = 'https://api.apify.com/v2/acts/giovannibiancia~doctoralia/run-sync-get-dataset-items?token=apify_api_6qoxc9LmA0SonlGCKjaSvHcYbDa4O21upWzl';
    return this.http.post(url, consulta, { headers: this.headers }).pipe(
      timeout(this.nTimeout),
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }
}
