import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import MedicosComponent from './medicos/medicos.component';



@NgModule({
  declarations: [
    MedicosComponent,
  ],  
  exports:[
    MedicosComponent,
  ],
  imports: [
    CommonModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    ToastModule,
    CalendarModule,
    FormsModule,
  ],
})
export class ComponentsModule { }
