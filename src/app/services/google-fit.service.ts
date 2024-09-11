// src/app/google-fit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleFitService {

  constructor(private http: HttpClient) { }

  getHeartRateData(token: string) {
    const url = 'https://www.googleapis.com/fitness/v1/users/me/dataSources';
    return this.http.get(url, {
      headers: {
        Authorization: `Bearer ${token}` // Necesitas el token OAuth
      }
    });
  }
}
