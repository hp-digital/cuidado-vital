import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {PacienteService} from '@services/paciente.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BluetoothService } from '../../services/bluetooth.service';
import { authConfig } from '../../auth/auth-config';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit {


  dataFormGroup: FormGroup;
  verSpinner:boolean = false;
  idRol: number=0;
  heartRate: number | null = null;
  oxygenSaturation: number | null = null;
  systolic: number | null = null; // Presión sistólica
  diastolic: number | null = null; // Presión diastólica

  dataSourceId: string | null = null;  // Identificador de la fuente de datos

  constructor(
    private pacienteService:PacienteService,
    private bluetoothService: BluetoothService,
    private oauthService: OAuthService, 
    private http: HttpClient,
    private settings: SettingsService
  ){
    this.dataFormGroup = new FormGroup({
      inputFechasEstadoCitas: new FormControl(''),
      inputFechasTipoSeguro: new FormControl(''),
      
    });
  }
  ngOnInit(): void {
    this.ObtenerConfiguracion();
    this.configure();
    this.idRol=this.settings.getUserSetting('idRol');
  }
  ObtenerConfiguracion(){                     
      forkJoin([        
        this.pacienteService.ObtenerPais(), 
        this.pacienteService.ObtenerDepartamento(),
        this.pacienteService.ObtenerProvincia(),
        this.pacienteService.ObtenerDistrito()
    ]
    )
    .subscribe(
      data => {               
        localStorage.setItem('Paises', JSON.stringify(data[0]));
        localStorage.setItem('Departamento', JSON.stringify(data[1]));
        localStorage.setItem('Provincia', JSON.stringify(data[2]));
        localStorage.setItem('Distrito', JSON.stringify(data[3]));
      },
      err =>{
        console.log(err);        
      } 
    );
  }

  connect() {
    this.bluetoothService.connectToDevice();
  }

  configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initImplicitFlow(undefined, { prompt: 'consent' });
  }

  fetchHeartRateData() {
    const token = this.oauthService.getAccessToken();

    // Paso 1: Obtén las fuentes de datos disponibles
    const dataSourceUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources';
    this.http.get(dataSourceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).subscribe(
      (response: any) => {
        console.log('Fuentes de datos disponibles:', response);
        // Encuentra la fuente de datos de frecuencia cardíaca
        const heartRateSource = response.dataSource.find((ds: any) => ds.dataType.name === 'com.google.heart_rate.bpm');
        const oxygenSource = response.dataSource.find((ds: any) => ds.dataType.name === 'com.google.oxygen_saturation');
        const bloodPressureSource = response.dataSource.find((ds: any) => ds.dataType.name === 'com.google.blood_pressure');
        if (heartRateSource) {
          this.dataSourceId = heartRateSource.dataStreamId;
          this.fetchHeartRateDataFromSource(token);
        } else {
          console.log('No se encontró la fuente de datos de frecuencia cardíaca.');
        }

        if (oxygenSource) {
          this.fetchOxygenSaturation(token, oxygenSource.dataStreamId);
        } else {
          console.log('No se encontró la fuente de datos de saturación de oxígeno.');
        }
    
        if (bloodPressureSource) {
          this.fetchBloodPressure(token, bloodPressureSource.dataStreamId);
        } else {
          console.log('No se encontró la fuente de datos de presión arterial.');
        }
      },
      error => {
        console.error('Error al obtener las fuentes de datos:', error);
        console.error('Detalles del error:', error.error);
      }
    );
  }

  fetchHeartRateDataFromSource(token: string) {
    const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';

    const body = {
      "aggregateBy": [{
        "dataTypeName": "com.google.heart_rate.bpm",
        "dataSourceId": this.dataSourceId
      }],
      "bucketByTime": { "durationMillis": 86400000 },  // Un día
      "startTimeMillis": Date.now() - 86400000,        // Un día atrás
      "endTimeMillis": Date.now()
    };

    this.http.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }).subscribe(
      (data: any) => {
        const point = data.bucket[0]?.dataset[0]?.point[0];
        
        if (point) {
          console.log("point", point);
          this.heartRate = point.value[0].fpVal.toFixed(2);
        } else {
          console.log('No se encontraron datos de frecuencia cardíaca.');
        }
      },
      error => {
        console.error('Error al obtener datos de Google Fit:', error);
        console.error('Detalles del error:', error.error);
      }
    );
  }

  fetchOxygenSaturation(token: string, dataSourceId: string) {
    const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
  
    const body = {
      "aggregateBy": [{
        "dataTypeName": "com.google.oxygen_saturation",
        "dataSourceId": dataSourceId
      }],
      "bucketByTime": { "durationMillis": 86400000 },  // Un día
      "startTimeMillis": Date.now() - 86400000,        // Un día atrás
      "endTimeMillis": Date.now()
    };
  
    this.http.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }).subscribe(
      (data: any) => {
        const point = data.bucket[0]?.dataset[0]?.point[0];
        if (point) {
          this.oxygenSaturation = point.value[0].fpVal; // El valor de saturación de oxígeno
          console.log('Saturación de oxígeno:', this.oxygenSaturation);
        } else {
          console.log('No se encontraron datos de saturación de oxígeno.');
        }
      },
      error => {
        console.error('Error al obtener datos de saturación de oxígeno:', error);
      }
    );
  }

  fetchBloodPressure(token: string, dataSourceId: string) {
    const url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
  
    const body = {
      "aggregateBy": [{
        "dataTypeName": "com.google.blood_pressure",
        "dataSourceId": dataSourceId
      }],
      "bucketByTime": { "durationMillis": 86400000 },  // Un día
      "startTimeMillis": Date.now() - 86400000,        // Un día atrás
      "endTimeMillis": Date.now()
    };
  
    this.http.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }).subscribe(
      (data: any) => {
        const point = data.bucket[0]?.dataset[0]?.point[0];
        if (point) {
          this.systolic = point.value[0].fpVal; // Presión sistólica
          this.diastolic = point.value[1].fpVal; // Presión diastólica
          console.log('Presión arterial:', `Sistólica: ${this.systolic}, Diastólica: ${this.diastolic}`);
        } else {
          console.log('No se encontraron datos de presión arterial.');
        }
      },
      error => {
        console.error('Error al obtener datos de presión arterial:', error);
      }
    );
  }
}
