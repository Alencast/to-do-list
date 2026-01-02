// src/app/pages/todo-create-page/todo-create-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms'; 
import { form, Field, metadata, REQUIRED, MIN, MAX } from '@angular/forms/signals'; 

import { TodoService } from '../../services/todo.service';
import { Button } from '../../componentes/button/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-todo-create-page',
  standalone: true,
  imports: [
    CommonModule, 
    Field, 
    Button,
    CardModule,
    InputTextModule,
    InputNumberModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="container mx-auto max-w-4xl">
        
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Nova Tarefa</h1>
          <p class="text-gray-600">Criar uma nova tarefa usando Angular 21 Signals</p>
        </div>

        <div class="mb-6">
          <app-button 
            label="Voltar"
            icon="pi pi-arrow-left"
            buttonClass="p-button-text"
            tooltip="Voltar à lista de tarefas"
            (clicked)="navigateToList()">
          </app-button>
        </div>

        <p-card class="shadow-lg rounded-lg">
          <form (submit)="$event.preventDefault(); createTodo()">
            
            <div class="flex flex-col gap-4">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input 
                  id="title"
                  type="text" 
                  pInputText 
                  [field]="todoForm.title"
                  placeholder="Digite o título da tarefa"
                  class="w-full" 
                  [class.ng-invalid]="todoForm.title().invalid() && todoForm.title().touched()" />
                
                @if (todoForm.title().errors().length && todoForm.title().touched()) {
                  <small class="text-red-500 block mt-1">O título é obrigatório.</small>
                }
              </div>
              
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <p-inputNumber
                  id="priority"
                  [field]="todoForm.priority"
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
                (clicked)="navigateToList()">
              </app-button>
              
              <app-button 
                label="Criar"
                icon="pi pi-plus-circle"
                buttonClass="p-button-success"
                [disabled]="todoForm().invalid()"
                (clicked)="createTodo()">
              </app-button>
            </div>

          </form>
        </p-card>
      </div>
    </div>
  `
})
export class TodoCreatePage {
  private router = inject(Router);
  private todoService = inject(TodoService);

  // Fonte da verdade: Signal original
  initialModel = signal({
    title: '',
    priority: 1,
    completed: false
  });

  // Signal Form: Mapeia o signal e aplica regras
  todoForm = form(this.initialModel, (f) => {
    metadata(f.title, REQUIRED, () => true);
    metadata(f.priority, MIN, () => 1);
    metadata(f.priority, MAX, () => 3);
  });

  createTodo() {
    // No Signal Forms, invalid() é um signal calculado (computed)
    if (this.todoForm().invalid()) {
      return;
    }

    // Extrai o valor atualizado do formulário
    const values = this.todoForm().value();

    this.todoService.createTodoInApi(values).subscribe({
      next: () => {
        alert('Tarefa criada com sucesso!');
        this.navigateToList();
      },
      error: (err) => {
        console.error('Erro ao criar:', err);
        alert('Erro ao salvar tarefa.');
      }
    });
  }

  navigateToList() {
    this.router.navigate(['/todos']);
  }
}