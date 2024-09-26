import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ConsultaDoctoraliaDTO } from '@models/cuerpo-envio-doctoralia';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ComboDTO } from '@models/ComboDTO';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  public nTimeout: number = 20000;
  public nRetry: number = 0;

  private apiUrl = 'https://api.openai.com/v1/chat/completions';  
  private apiKey = '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';  

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

  comboSINO: ComboDTO[] = [{ 'id': 1, 'nombre': 'SI' }, { 'id': 2, 'nombre': 'NO' }];  
  comboComplicaciones: ComboDTO[] = [{ 'id': 1, 'nombre': 'SI' }, { 'id': 2, 'nombre': 'NO' }, {'id': 3, 'nombre': 'DESCONOCIDO' }];  
  
  constructor(private http: HttpClient) { }

  ObtenerDirectorioMedico(consulta: ConsultaDoctoraliaDTO) {
    const url = 'https://api.apify.com/v2/acts/giovannibiancia~doctoralia/run-sync-get-dataset-items?token=apify_api_6qoxc9LmA0SonlGCKjaSvHcYbDa4O21upWzl';
    return this.http.post(url, consulta, { headers: this.headers }).pipe(
      timeout(this.nTimeout),
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  // Método para hacer la solicitud a  OpenAI
  generateText(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`  
    });

    const body = {
      model: 'gpt-3.5-turbo',  
      messages: [
        { role: 'system', content: 'You are a helpful doctor.' }, 
        { role: 'user', content: prompt } 
      ],
      max_tokens: 1000, 
      temperature: 0.7
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

  ObtenerSINO():ComboDTO[]{
    return this.comboSINO;
  }
  ObtenerComplicaciones():ComboDTO[]{
    return this.comboComplicaciones;
  }
}
