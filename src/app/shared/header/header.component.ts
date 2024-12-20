import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  nombreUsuario: string = "";
  usuario: string ="";
  idRol: number = 0;


  constructor(
    private authService: AuthService,
    public settings: SettingsService
  ){

  }

  ngOnInit(): void {
    this.settings.isAuthenticated();
    this.nombreUsuario = this.settings.getUserSetting('nombres');
    this.usuario = this.settings.getUserSetting('usuario');
    this.idRol = this.settings.getUserSetting('idRol');

    console.log("nombre usuario", this.nombreUsuario);
  }

  logOut(){
    this.authService.logout();
  }
}
