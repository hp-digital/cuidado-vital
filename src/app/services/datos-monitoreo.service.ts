import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComboKatzDTO } from '@models/comboKatzDTO';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl; 
@Injectable({
  providedIn: 'root'
})
export class DatosMonitoreoService {
  ObtenerAlimentacion(): Observable<ComboKatzDTO[]> {
        return this.http.get<ComboKatzDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboAlimentacion`)
  }
  ObtenerContinencia(): Observable<ComboKatzDTO[]> {
        return this.http.get<ComboKatzDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboContinencia`)
  }
  ObtenerMovilidad(): Observable<ComboKatzDTO[]> {
        return this.http.get<ComboKatzDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboMovilidad`)
  }
  ObtenerWC(): Observable<ComboKatzDTO[]> {
        return this.http.get<ComboKatzDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboWC`)
  }
  ObtenerVestido(): Observable<ComboKatzDTO[]> {
        return this.http.get<ComboKatzDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboVestido`)
  }
  ObtenerBanio(): Observable<ComboKatzDTO[]> {
    return this.http.get<ComboKatzDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboBanio`)
  }

  constructor(private http: HttpClient) { }
}
