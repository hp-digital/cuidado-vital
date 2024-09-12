import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent  implements OnInit{

  idRol:number = 0;

  constructor(
   private settings: SettingsService
  ){

  }

  ngOnInit(): void {
    this.idRol=this.settings.getUserSetting('idRol');
    console.log("rol sidebar", this.idRol)
  }
}
