import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public user: any;    
  helper = new JwtHelperService();

  constructor() {
    this.user = {
      idUsuario:'',
      idPersonal:'',
      usuario: '',      
      nombres:'',
      apellidos:'',
      idRol:'',
      isAuthenticated:false,          
      isAdmin:false,
    };
   }

   getUserSetting(name: any) {
    return name ? this.user[name] : this.user;
  }

  setUserSetting(name:any, value:any) {
    if (typeof this.user[name] !== 'undefined') {
        this.user[name] = value;
    }
  }

  isAuthenticated(){
    if (localStorage.getItem('authToken') !== undefined && localStorage.getItem('authToken')) {        
         
        this.setUserSetting('isAuthenticated',true);
        const token:any = localStorage.getItem('authToken');
        const decodeToken = this.helper.decodeToken(token);        
        this.setUserSetting('idUsuario', decodeToken.idUsuario);
        this.setUserSetting('idPersonal', decodeToken.idPersonal);
        this.setUserSetting('usuario', decodeToken.usuario);
        this.setUserSetting('idRol', decodeToken.idRol);  
        this.setUserSetting('nombres', decodeToken.nombres);
        this.setUserSetting('apellidos', decodeToken.apellidos);
        /* if(Array.isArray(decodeToken.idRol)){
          let aRol:number[]=[];
          decodeToken.idRol.forEach((element:any) => {
            aRol.push(Number(element));
          });
          this.setUserSetting('idRol', aRol);  
        } */

      return true;
    }
    else{
      return false;
    }
  }
}
