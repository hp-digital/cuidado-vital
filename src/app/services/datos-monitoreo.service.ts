import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComboDTO } from '@models/ComboDTO';
import { ComboKatzDTO } from '@models/comboKatzDTO';
import { DesplegableDTO } from '@models/depleglable';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;
@Injectable({
      providedIn: 'root'
})
export class DatosMonitoreoService {

      
      constructor(private http: HttpClient) { }

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
      ObtenerFaseEpoc(): Observable<ComboDTO[]> {
            return this.http.get<ComboDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboFaseEpoc`)
      }
      ObtenerPresion(): Observable<DesplegableDTO[]> {
            return this.http.get<DesplegableDTO[]>(`${API_URL}DataMonitoreo/ObtenerComboEstadoPresion`)
      }
}
