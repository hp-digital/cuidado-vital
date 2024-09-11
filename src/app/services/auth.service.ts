import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { LoginDTO } from '../models/LoginDTO';



const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public nTimeout: number = 20000;
  public nRetry: number = 0;

  private tokenKey = 'authToken';


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
  constructor(private httpClient: HttpClient, private router:Router) { }

  public Ingresar(data: LoginDTO) {
    const url = `${API_URL}Autenticacion/Login`;
    return this.httpClient.post(url, data, { headers: this.headers }).pipe(
      /* timeout(this.nTimeout), */
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  logger(login:LoginDTO): Observable<any>{
    const url = `${API_URL}Autenticacion/Login`;
    return this.httpClient.post<any>(url,login).pipe(
      tap(response => {
        if(response.token)
        {
          console.log(response);
          this.setToken(response.token);
        }
      })
    )
  }

  private setToken(token:string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null{
    if(typeof window !== 'undefined'){
      return localStorage.getItem(this.tokenKey);
    }else{
      return null;
    }
  }
  
  isAutenticated(): boolean{
    const token = this.getToken();
    if(!token){
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;

    return Date.now() < exp;
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login'])
  }
}
