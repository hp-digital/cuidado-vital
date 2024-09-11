import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent:() => import('./shared/layout/layout.component'),
        children: [
            {
                path:'dashboard',
                loadComponent:() => import('./pages/dashboard/dashboard.component'),
                canActivate: [AuthGuard]
            },
            {
                path:'pacientes',
                loadComponent:() => import('./components/pacientes/pacientes.component'),
                canActivate: [AuthGuard]
            },
            {
                path:'servicios',
                loadComponent:() => import('./components/atenciones/servicios/servicios.component'),
                canActivate: [AuthGuard]
            },
            {
                path:'atenciones',
                loadComponent:() => import('./components/atenciones/atenciones.component'),
                canActivate: [AuthGuard]
            },
            {
                path:'',
                redirectTo:'dashboard',
                pathMatch:'full',
            }
        ]
    },
    {
        path:'login',
        loadComponent: () => import('./pages/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path:'register',
        loadComponent: () => import('./pages/register/register.component')
    },
    {
        path:'**',
        redirectTo: 'dashboard'
    }
];
