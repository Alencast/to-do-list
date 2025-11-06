import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { TodoItem } from '../../models/todo-item.model';
import { Button } from '../button/button';

@Component({
  selector: 'app-todo-form',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    RippleModule,
    TooltipModule,
    Button
  ],
  template: `
    <p-dialog 
      [header]="editMode ? 'Editar Tarefa' : 'Nova Tarefa'"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '450px' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onCancel()">
      
      <div class="flex flex-col gap-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input 
            id="title"
            type="text" 
            pInputText 
            [(ngModel)]="todoData.title"
            placeholder="Digite o título da tarefa"
            class="w-full" />
        </div>
        
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
            Prioridade
          </label>
          <p-inputNumber
            id="priority"
            [(ngModel)]="todoData.priority"
            [min]="1"
            [max]="3"
            [showButtons]="true"
            buttonLayout="horizontal"
            spinnerMode="horizontal"
            [step]="1"
            decrementButtonClass="p-button-secondary"
            incrementButtonClass="p-button-secondary"
            class="w-full">
          </p-inputNumber>
          <small class="text-gray-500">1 = Alta, 2 = Média, 3 = Baixa</small>
        </div>
        
        <div *ngIf="editMode">
          <label class="flex items-center gap-2">
            <p-checkbox 
              [binary]="true"
              [(ngModel)]="todoData.completed">
            </p-checkbox>
            <span class="text-sm font-medium text-gray-700">Tarefa concluída</span>
          </label>
        </div>
      </div>
      
      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <app-button 
            label="Cancelar"
            icon="pi pi-ban"
            buttonClass="p-button-text"
            tooltip="Cancelar operação"
            (clicked)="onCancel()">
          </app-button>
          
          <app-button 
            [label]="editMode ? 'Atualizar' : 'Criar'"
            [icon]="editMode ? 'pi pi-save' : 'pi pi-plus-circle'"
            tooltip="Salvar tarefa"
            (clicked)="onSave()">
          </app-button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class TodoFormComponent {
  @Input() todo: TodoItem = {
    id: 0,
    title: '',
    priority: 1,
    completed: false
  };
  @Input() editMode = false;
  @Input() visible = false;
  @Output() save = new EventEmitter<TodoItem>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  todoData: TodoItem = {
    id: 0,
    title: '',
    priority: 1,
    completed: false
  };

  ngOnChanges() {
    // Copia os dados do todo de entrada para o formulário
    this.todoData = { ...this.todo };
  }

  onSave() {
    if (!this.todoData.title.trim()) {
      return; // Deixa a validação para o componente pai
    }
    this.save.emit({ ...this.todoData });
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }
}