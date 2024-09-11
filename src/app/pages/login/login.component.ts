import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import moment from 'moment';
import { LoginDTO } from '../../models/LoginDTO';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  dataFormGroup: FormGroup;
  dataLogin = new LoginDTO();

  constructor(
    private authService: AuthService,
    private router: Router
  ){
    this.dataFormGroup = new FormGroup({
      inputUsuario: new FormControl(),
      inputPassword: new FormControl(),
    });
  }

  login(): void{
    this.dataLogin.usuario = this.dataFormGroup.controls['inputUsuario'].value;
    this.dataLogin.clave = this.dataFormGroup.controls['inputPassword'].value;

    console.log(this.dataLogin);
    this.authService.logger(this.dataLogin).subscribe({
      next: ()=> this.router.navigate(['/dashboard']),
      error: (err) => console.error('Login failed', err),
    })
  }
}
