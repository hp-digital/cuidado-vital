import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ComboDTO } from '../models/ComboDTO';
import { environment } from '../../environments/environment';
import { DepartamentoDTO} from '@models/DepartamentoDTO';
import { ProvinciaDTO} from '@models/ProvinciaDTO';
import { DistritoDTO} from '@models/DistritoDTO';
import { ListadoBusquedaPacienteDTO } from '../models/ListadoBusquedaPacienteDTO';




const API_URL = environment.apiUrl; 

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
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

  ObtenerTipoDocumento(): Observable<ComboDTO[]>{
    return this.http.get<ComboDTO[]>(`${API_URL}TipoDocumento/ObtenerCombo`)
  }

  ObtenerEstadoCivil(): Observable<ComboDTO[]>{
    return this.http.get<ComboDTO[]>(`${API_URL}EstadoCivil/ObtenerListado`)
  }

  ObtenerEspecialidadMedica(){
    return this.http.get<ComboDTO[]>(`${API_URL}EspecialidadMedica/ObtenerCombo`)
  }

  ObtenerPais() {
    return this.http.get<ComboDTO[]>(`${API_URL}Pais/ObtenerCombo`);
  } 

  ObtenerDepartamento(){
    return this.http.get<DepartamentoDTO[]>(`${API_URL}Departamento/ObtenerCombo`);
  }

  ObtenerProvincia(){
    return this.http.get<ProvinciaDTO[]>(`${API_URL}Provincia/ObtenerCombo`);
  }

  ObtenerDistrito(){
    return this.http.get<DistritoDTO[]>(`${API_URL}Distrito/ObtenerCombo`);
  }

  ObtenerPacienteCombo() {
    return this.http.get<ComboDTO[]>(`${API_URL}Paciente/ObtenerComboPaciente`);
  }

  ObtenerPacienteConsulta(criterioBusqueda: string) {
    return this.http.get<ListadoBusquedaPacienteDTO[]>(`${API_URL}Paciente/ObtenerListadoPacienteBusqueda?${criterioBusqueda}`);
  }

  ObtenerDepartamentos(id: number): ComboDTO[] {
    let listaDepartamento: DepartamentoDTO[] = JSON.parse(localStorage.getItem('Departamento')!);
    let comboDepartamento: ComboDTO[] = [];
    listaDepartamento.forEach(element => {
      let departamento = new ComboDTO();
      if (element.idPais == id) {
        departamento.id = element.id;
        departamento.nombre = element.nombre;
        comboDepartamento.push(departamento);
      }
    });
    return comboDepartamento;
  }

  ObtenerProvincias(id: number): ComboDTO[] {
    let listaProvincias: ProvinciaDTO[] = JSON.parse(localStorage.getItem('Provincia')!);
    let comboProvincia: ComboDTO[] = [];
    listaProvincias.forEach(element => {
      let provincia = new ComboDTO();
      if (element.idDepartamento == id) {
        provincia.id = element.id;
        provincia.nombre = element.nombre;
        comboProvincia.push(provincia);
      }
    });
    return comboProvincia;
  }

  ObtenerDistritos(id: number): ComboDTO[] {
    let listaDistritos: DistritoDTO[] = JSON.parse(localStorage.getItem('Distrito')!);
    let comboDistrito: ComboDTO[] = [];
    listaDistritos.forEach(element => {
      let distrito = new ComboDTO();
      if (element.idProvincia == id) {
        distrito.id = element.id;
        distrito.nombre = element.nombre;
        comboDistrito.push(distrito);
      }
    });
    return comboDistrito;
  }

  ObtenerSexo() {
    return this.http.get<ComboDTO[]>(`${API_URL}Sexo/ObtenerCombo`);
  }

  ObtenerPacientePorNroDocumento(nroDocumento: string) {
    return this.http.get<any>(`${API_URL}Paciente/BuscarPorDni?dni=${nroDocumento}`);
  }
}
