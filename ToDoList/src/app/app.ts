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
  
  todos = signal<TodoItem[]>([
    { id: 1, title: 'Completar projeto Angular', priority: 1, completed: false },
    { id: 2, title: 'Estudar PrimeNG', priority: 2, completed: true },
    { id: 3, title: 'Implementar Tailwind CSS', priority: 3, completed: false }
  ]);

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
    private confirmationService: ConfirmationService
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

  saveTodo(todoData?: TodoItem) {
    // se não recebeu os dados do componente, usa os dados locais
    const todoToSave = todoData || this.newTodo;
    
    if (!todoToSave.title.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Título é obrigatório'
      });
      return;
    }

    if (this.editMode()) {
      // Atualizar todo existente
      const currentTodos = this.todos();
      const index = currentTodos.findIndex(t => t.id === todoToSave.id);
      if (index !== -1) {
        currentTodos[index] = { ...todoToSave };
        this.todos.set([...currentTodos]);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Item atualizado com sucesso'
        });
      }
    } else {
      //  novo todo
      const newId = Math.max(...this.todos().map(t => t.id), 0) + 1;
      todoToSave.id = newId;
      this.todos.set([...this.todos(), { ...todoToSave }]);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Item criado com sucesso'
      });
    }

    this.showDialog.set(false);
  }

  deleteTodo(todo: TodoItem) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir "${todo.title}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.todos.set(this.todos().filter(t => t.id !== todo.id));
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Item excluído com sucesso'
        });
      }
    });
  }

  toggleCompleted(todo: TodoItem) {
    const currentTodos = this.todos();
    const index = currentTodos.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      currentTodos[index].completed = !currentTodos[index].completed;
      this.todos.set([...currentTodos]);
    }
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
    return this.todos().filter(todo => todo.completed).length;
  }

  closeViewDialog() {
    this.selectedTodo.set(null);
    this.showSelectedDialog.set(false);
  }
}
