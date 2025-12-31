import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./componentes/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'todos/new', 
    loadComponent: () => import('./pages/todo-create-page/todo-create-page.component').then(m => m.TodoCreatePageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'todos/:id/edit', 
    loadComponent: () => import('./pages/todo-edit-page/todo-edit-page.component').then(m => m.TodoEditPageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'todos/:id', 
    loadComponent: () => import('./pages/todo-detail-page/todo-detail-page.component').then(m => m.TodoDetailPageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'todos', 
    loadComponent: () => import('./pages/todo-list-page/todo-list-page.component').then(m => m.TodoListPageComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/todos' }
];
