import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent:() => import('./shared/layout/layout.component'),
        children: [
            {
                path:'dashboard',
                loadComponent:() => import('./pages/dashboard/dashboard.component'),
            },
            {
                path:'pacientes',
                loadComponent:() => import('./components/pacientes/pacientes.component'),
            },
            {
                path:'servicios',
                loadComponent:() => import('./components/atenciones/servicios/servicios.component'),
            },
            {
                path:'atenciones',
                loadComponent:() => import('./components/atenciones/atenciones.component'),
            },
            {
                path:'',
                redirectTo:'dashboard',
                pathMatch:'full',
            }
        ]
    }
];
