import { Injectable } from '@angular/core';
import { ComboKatzDTO } from '@models/comboKatzDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosMonitoreoService {
  ObtenerAlimentacion(): Observable<ComboKatzDTO[]> {
    throw new Error('Method not implemented.');
  }
  ObtenerContinencia(): Observable<ComboKatzDTO[]> {
    throw new Error('Method not implemented.');
  }
  ObtenerMovilidad(): Observable<ComboKatzDTO[]> {
    throw new Error('Method not implemented.');
  }
  ObtenerWC(): Observable<ComboKatzDTO[]> {
    throw new Error('Method not implemented.');
  }
  ObtenerVestido(): Observable<ComboKatzDTO[]> {
    throw new Error('Method not implemented.');
  }
  ObtenerBanio(): Observable<ComboKatzDTO[]> {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
