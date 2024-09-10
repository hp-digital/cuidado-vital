// src/app/bluetooth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor() { }

  async connectToDevice() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]  // Busca el servicio de frecuencia cardíaca (heart_rate)
      });
      console.log('Dispositivo conectado:', device.name);

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService('heart_rate');
      const characteristic = await service?.getCharacteristic('heart_rate_measurement');

      characteristic?.startNotifications();
      characteristic?.addEventListener('characteristicvaluechanged', this.handleHeartRate);
    } catch (error) {
      console.error('Error al conectar al dispositivo:', error);
    }
  }

  handleHeartRate(event: any) {
    const value = event.target.value;
    const heartRate = value.getUint8(1); // Extrae la frecuencia cardíaca del valor
    console.log('Frecuencia cardíaca:', heartRate);
    document.getElementById('heartRate')!.textContent = heartRate + ' bpm';
  }
}
