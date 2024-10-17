import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection; 
  public messageReceived = new BehaviorSubject<{ user: string, message: string }>({user:' ',message:' '});
  public messageHistoryReceived = new BehaviorSubject<{ user: string, message: string }[]>([]);
  public usersOnline = new BehaviorSubject<string[]>([]);

  constructor(
  ) { 
    
  }

    // Iniciar la conexión a SignalR
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7233/chatHub')  // URL del Hub en el servidor
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Conectado a SignalR'))
      .catch(err => console.log('Error al conectar a SignalR: ', err));

    // Recibir mensajes
    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.messageReceived.next({ user, message });
    });

    // Recibir usuarios conectados
    this.hubConnection.on('UserConnected', (userId: string, connectedUsers: string[]) => {
      this.usersOnline.next(connectedUsers);
    });

    // Recibir notificación de usuarios desconectados
    this.hubConnection.on('UserDisconnected', (userId: string, connectedUsers: string[]) => {
      this.usersOnline.next(connectedUsers);
    });
  }

  // Enviar mensajes
  public sendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }
}
