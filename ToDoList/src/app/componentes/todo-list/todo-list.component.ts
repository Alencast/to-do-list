import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { TodoItem } from '../../models/todo-item.model';
import { Button } from '../button/button';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    CheckboxModule,
    TooltipModule,
    Button
  ],
  template: `
    <p-card class="shadow-lg rounded-lg">
      <p-table 
        [value]="todos" 
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
                (onChange)="onToggleCompleted(todo)">
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
                  (clicked)="onViewTodo(todo)">
                </app-button>
                
                <app-button 
                  label="Editar"
                  icon="pi pi-pencil"
                  buttonClass="p-button-text p-button-warning p-button-sm"
                  tooltip="Editar esta tarefa"
                  (clicked)="onEditTodo(todo)">
                </app-button>
                
                <app-button 
                  label="Remover"
                  icon="pi pi-times"
                  buttonClass="p-button-text p-button-danger p-button-sm"
                  tooltip="Excluir esta tarefa"
                  (clicked)="onDeleteTodo(todo)">
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
  `
})
export class TodoListComponent {
  @Output() viewTodo = new EventEmitter<TodoItem>();
  @Output() editTodo = new EventEmitter<TodoItem>();

  constructor(private todoService: TodoService) {}

  // Getter para acessar os todos do service
  get todos() {
    return this.todoService.getTodos()();
  }

  onViewTodo(todo: TodoItem) {
    this.viewTodo.emit(todo);
  }

  onEditTodo(todo: TodoItem) {
    this.editTodo.emit(todo);
  }

  onDeleteTodo(todo: TodoItem) {
    // Usa o service diretamente para deletar
    this.todoService.deleteTodo(todo.id);
  }

  onToggleCompleted(todo: TodoItem) {
    // Usa o service diretamente para toggle
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
}