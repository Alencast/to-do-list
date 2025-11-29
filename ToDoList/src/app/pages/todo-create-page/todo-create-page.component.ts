import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo-item.model';
import { Button } from '../../componentes/button/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-todo-create-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    CardModule,
    InputTextModule,
    InputNumberModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="container mx-auto max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Nova Tarefa</h1>
          <p class="text-gray-600">Criar uma nova tarefa</p>
        </div>

        <!-- Navigation -->
        <div class="mb-6">
          <app-button 
            label="Voltar"
            icon="pi pi-arrow-left"
            buttonClass="p-button-text"
            tooltip="Voltar à lista de tarefas"
            (clicked)="navigateToList()">
          </app-button>
        </div>

        <!-- Form -->
        <p-card class="shadow-lg rounded-lg">
          <div class="flex flex-col gap-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input 
                id="title"
                type="text" 
                pInputText 
                [(ngModel)]="newTodo.title"
                placeholder="Digite o título da tarefa"
                class="w-full" />
            </div>
            
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <p-inputNumber
                id="priority"
                [(ngModel)]="newTodo.priority"
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
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <app-button 
              label="Cancelar"
              icon="pi pi-ban"
              buttonClass="p-button-text"
              tooltip="Cancelar operação"
              (clicked)="navigateToList()">
            </app-button>
            
            <app-button 
              label="Criar"
              icon="pi pi-plus-circle"
              buttonClass="p-button-success"
              tooltip="Criar tarefa"
              (clicked)="createTodo()">
            </app-button>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class TodoCreatePageComponent {
  newTodo: TodoItem = {
    id: 0,
    title: '',
    priority: 1,
    completed: false
  };

  private router = inject(Router);
  private todoService = inject(TodoService);

  createTodo() {
    if (!this.newTodo.title.trim()) {
      alert('Título é obrigatório');
      return;
    }

    this.todoService.addTodo(this.newTodo);
    alert('Tarefa criada com sucesso!');
    this.router.navigate(['/todos']);
  }

  navigateToList() {
    this.router.navigate(['/todos']);
  }
}