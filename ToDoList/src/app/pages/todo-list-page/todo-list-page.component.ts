import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo-item.model';
import { Button } from '../../componentes/button/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list-page',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    ToolbarModule,
    CardModule,
    TableModule,
    CheckboxModule,
    TooltipModule,
    FormsModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="container mx-auto max-w-6xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">ToDo List</h1>
          <p class="text-gray-600">Gerencie suas tarefas</p>
        </div>

        <!-- Toolbar -->
        <p-toolbar class="mb-6 rounded-lg shadow-sm">
          <div class="p-toolbar-group-start">
            <app-button 
              label="Nova Tarefa"
              icon="pi pi-plus-circle"
              buttonClass="p-button-success"
              tooltip="Criar uma nova tarefa"
              (clicked)="navigateToCreate()">
            </app-button>
            
            <app-button 
              label="Testar API"
              icon="pi pi-bolt"
              buttonClass="p-button-info ml-2"
              tooltip="Testar conexão com Django REST API"
              (clicked)="testApi()">
            </app-button>
            
            <app-button 
              label="Recarregar"
              icon="pi pi-refresh"
              buttonClass="p-button-secondary ml-2"
              tooltip="Recarregar tarefas do backend"
              (clicked)="reloadTodos()">
            </app-button>
          </div>
          <div class="p-toolbar-group-end">
            <span class="text-sm text-gray-600">
              Total: {{ todoService.getTotalCount() }} | 
              Concluídas: {{ todoService.getCompletedCount() }}
            </span>
          </div>
        </p-toolbar>

        <!-- Lista de Tarefas -->
        <p-card class="shadow-lg rounded-lg">
          <p-table 
            [value]="todoService.getTodos()()" 
            styleClass="p-datatable-gridlines"
            [tableStyle]="{ 'min-width': '50rem' }"
            responsiveLayout="scroll">
            
            <ng-template pTemplate="header">
              <tr>
                <th class="w-12">Status</th>
                <th>Título</th>
                <th class="w-32">Prioridade</th>
                <th class="w-48">Ações</th>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="body" let-todo>
              <tr [class.opacity-60]="todo.completed">
                <td>
                  <p-checkbox 
                    [binary]="true"
                    [ngModel]="todo.completed"
                    (onChange)="toggleCompleted(todo)">
                  </p-checkbox>
                </td>
                <td>
                  <span [class.line-through]="todo.completed" class="text-lg">
                    {{ todo.title }}
                  </span>
                </td>
                <td>
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    [class]="'bg-' + getPrioritySeverity(todo.priority) + '-100 text-' + getPrioritySeverity(todo.priority) + '-800'">
                    {{ getPriorityLabel(todo.priority) }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2 justify-center flex-wrap">
                    <app-button 
                      label="Ver"
                      icon="pi pi-eye"
                      buttonClass="p-button-text p-button-info p-button-sm"
                      tooltip="Visualizar detalhes da tarefa"
                      (clicked)="navigateToDetail(todo)">
                    </app-button>
                    
                    <app-button 
                      label="Editar"
                      icon="pi pi-pencil"
                      buttonClass="p-button-text p-button-warning p-button-sm"
                      tooltip="Editar esta tarefa"
                      (clicked)="navigateToEdit(todo)">
                    </app-button>
                    
                    <app-button 
                      label="Remover"
                      icon="pi pi-times"
                      buttonClass="p-button-text p-button-danger p-button-sm"
                      tooltip="Excluir esta tarefa"
                      (clicked)="deleteTodo(todo)">
                    </app-button>
                  </div>
                </td>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="text-center py-8">
                  <div class="text-gray-500">
                    <i class="pi pi-info-circle text-3xl mb-3 block"></i>
                    Nenhuma tarefa encontrada. Clique em "Nova Tarefa" para começar!
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `
})
export class TodoListPage {
  protected todoService = inject(TodoService);
  private router = inject(Router);

  ngOnInit() {
    // Carregar tarefas do backend ao inicializar a página
    this.todoService.loadTodosFromApi();
  }

  navigateToCreate() {
    this.router.navigate(['/todos/new']);
  }

  navigateToDetail(todo: TodoItem) {
    this.router.navigate(['/todos', todo.id]);
  }

  navigateToEdit(todo: TodoItem) {
    this.router.navigate(['/todos', todo.id, 'edit']);
  }

  deleteTodo(todo: TodoItem) {
    if (confirm(`Tem certeza que deseja excluir "${todo.title}"?`)) {
      // Deletar tarefa no backend via API
      this.todoService.deleteTodoFromApi(todo.id).subscribe({
        next: () => {
          console.log('✅ Tarefa deletada do backend:', todo.title);
          // Recarregar lista após deletar
          this.todoService.loadTodosFromApi();
        },
        error: (error) => {
          console.error('❌ Erro ao deletar tarefa:', error);
          alert('Erro ao deletar tarefa. Verifique o console.');
        }
      });
    }
  }

  toggleCompleted(todo: TodoItem) {
    this.todoService.toggleCompleted(todo.id);
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
      case 1: return 'red';
      case 2: return 'yellow';
      case 3: return 'green';
      default: return 'blue';
    }
  }

  testApi() {
    console.log('🚀 Iniciando teste da API Django...');
    this.todoService.testApiConnection();
  }

  reloadTodos() {
    console.log('🔄 Recarregando tarefas do backend...');
    this.todoService.loadTodosFromApi();
  }
}