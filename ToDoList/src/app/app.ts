import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { TodoItem } from './models/todo-item.model';
import { Button } from './componentes/button/button';
import { TodoListComponent } from './componentes/todo-list/todo-list.component';
import { TodoFormComponent } from './componentes/todo-form/todo-form.component';
import { TodoDetailComponent } from './componentes/todo-detail/todo-detail.component';
import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Button,
    TodoListComponent,
    TodoFormComponent,
    TodoDetailComponent,
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    CardModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    RippleModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ToDo List');
  
  showDialog = signal(false);
  showSelectedDialog = signal(false);
  editMode = signal(false);
  selectedTodo = signal<TodoItem | null>(null);
  
  newTodo: TodoItem = {
    id: 0,
    title: '',
    priority: 1,
    completed: false
  };

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private todoService: TodoService
  ) {}

  openNew() {
    this.newTodo = {
      id: 0,
      title: '',
      priority: 1,
      completed: false
    };
    this.editMode.set(false);
    this.showDialog.set(true);
  }

  editTodo(todo: TodoItem) {
    this.newTodo = { ...todo };
    this.editMode.set(true);
    this.showDialog.set(true);
  }

  viewTodo(todo: TodoItem) {
    this.selectedTodo.set(todo);
    this.showSelectedDialog.set(true);
  }

  saveTodo() {
    // Usa o service diretamente
    this.showDialog.set(false);
  }

  deleteTodo(todo: TodoItem) {
    
  }

  toggleCompleted(todo: TodoItem) {
    // Método mantido para compatibilidade, mas componente usa service diretamente
  }

  getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1: return 'Alta';
      case 2: return 'Média';
      case 3: return 'Baixa';
      default: return 'Média';
    }
  }

  getPrioritySeverity(priority: number): string {
    switch (priority) {
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'success';
      default: return 'info';
    }
  }

  getCompletedCount(): number {
    return this.todoService.getCompletedCount();
  }

  getTotalCount(): number {
    return this.todoService.getTotalCount();
  }

  closeViewDialog() {
    this.selectedTodo.set(null);
    this.showSelectedDialog.set(false);
  }
}
