import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { TodoItem } from '../../models/todo-item.model';
import { Button } from '../button/button';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-detail',
  imports: [
    CommonModule,
    DialogModule,
    RippleModule,
    TooltipModule,
    Button
  ],
  template: `
    <p-dialog 
      header="Detalhes da Tarefa"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '400px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onClose()">
      
      <div *ngIf="todo" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <p class="text-gray-900">{{ todo.id }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <p class="text-gray-900">{{ todo.title }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
          <span 
            class="inline-block px-3 py-1 rounded-full text-sm font-medium"
            [class]="'bg-' + getPrioritySeverity(todo.priority) + '-100 text-' + getPrioritySeverity(todo.priority) + '-800'">
            {{ getPriorityLabel(todo.priority) }}
          </span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <span 
            class="inline-block px-3 py-1 rounded-full text-sm font-medium"
            [class]="todo.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
            {{ todo.completed ? 'Concluída' : 'Pendente' }}
          </span>
        </div>
      </div>
      
      <ng-template pTemplate="footer">
        <div class="flex justify-end">
          <app-button 
            label="Fechar"
            icon="pi pi-arrow-left"
            tooltip="Voltar à lista de tarefas"
            (clicked)="onClose()">
          </app-button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class TodoDetailComponent {
  @Input() todo: TodoItem | null = null;
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(private todoService: TodoService) {}

  onClose() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.close.emit();
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