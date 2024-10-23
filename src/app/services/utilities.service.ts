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

  private apiUrlVideo = 'https://rnckc-200-106-13-121.a.free.pinggy.link/stream.m3u8';

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
  comboResultadoKatz: ComboDTO[]=[{ 'id': 1, 'nombre': 'Dependiente' }, { 'id': 2, 'nombre': 'Independiente' }] ;
  comboFaseEpoc: ComboDTO[]=[{ 'id': 1, 'nombre': 'Fase I (Leve)' }, { 'id': 2, 'nombre': 'Fase II (Moderada)' }, {'id': 3, 'nombre': 'Fase III (Grave)'}, {'id':4 ,'nombre':'Fase IV (Muy Grave)'}];
  comboHabitoNocivo: ComboDTO[] = [{ 'id': 1, 'nombre': 'Si' }, { 'id': 2, 'nombre': 'No' }, {'id': 3, 'nombre': 'Ocasional' }]; 
  comboSintomaRespiratorio: ComboDTO[] = [{ 'id': 1, 'nombre': 'Normal' }, { 'id': 2, 'nombre': 'Alterado' }];  
  
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

   // Método para hacer una solicitud GET
   getData(): Observable<any> {
    const headers = new HttpHeaders({
      //'User-Agent': 'CustomUserAgent/1.0'  // User-Agent personalizado
    });

    return this.http.get(this.apiUrlVideo, { headers });
  }

  ObtenerSINO():ComboDTO[]{
    return this.comboSINO;
  }
  ObtenerComplicaciones():ComboDTO[]{
    return this.comboComplicaciones;
  }
  ObtenerComboResultadoKatz():ComboDTO[]{
    return this.comboResultadoKatz;
  }
  ObtenerComboFaseEpoc():ComboDTO[]{
    return this.comboFaseEpoc;
  }
  ObtenerComboHabitoNocivo():ComboDTO[]{
    return this.comboHabitoNocivo;
  }
  ObtenerComboSintomaRespiratorio():ComboDTO[]{
    return this.comboSintomaRespiratorio;
  }
}
