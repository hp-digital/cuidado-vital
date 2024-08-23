import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CalendarModule } from 'primeng/calendar';
import { TreeSelectModule } from 'primeng/treeselect';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-datos-paciente',
  standalone: true,
  imports: [CalendarModule, FormsModule, TreeSelectModule],
  templateUrl: './datos-paciente.component.html',
  styleUrl: './datos-paciente.component.css',
  providers: [provideAnimations()]
})
export class DatosPacienteComponent implements OnInit{

  date1: Date | undefined;
  nodes: any[]=['Soltero', 'Casado'];
  nodeOcupacion: any[]=['Ing', 'Medico'];
  node!: any[];
  selectedNodes: any;

  constructor(private bsModalRefEditarDatosGenerales: BsModalRef){

  }
  ngOnInit(): void {
    
  }

  CerrarModal() {
    this.bsModalRefEditarDatosGenerales.hide();
  }
}
