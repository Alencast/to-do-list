import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  { 
    path: 'todos/new', 
    loadComponent: () => import('./pages/todo-create-page/todo-create-page.component').then(m => m.TodoCreatePageComponent)
  },
  { 
    path: 'todos/:id/edit', 
    loadComponent: () => import('./pages/todo-edit-page/todo-edit-page.component').then(m => m.TodoEditPageComponent)
  },
  { 
    path: 'todos/:id', 
    loadComponent: () => import('./pages/todo-detail-page/todo-detail-page.component').then(m => m.TodoDetailPageComponent)
  },
  { 
    path: 'todos', 
    loadComponent: () => import('./pages/todo-list-page/todo-list-page.component').then(m => m.TodoListPageComponent)
  },
  { path: '**', redirectTo: '/todos' }
];
