import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo-item.model';
import { Button } from '../../componentes/button/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-todo-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    CardModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div class="container mx-auto max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Editar Tarefa</h1>
          <p class="text-gray-600">Atualizar informações da tarefa</p>
        </div>

        <!-- Navigation -->
        <div class="mb-6 flex gap-2">
          <app-button 
            label="Voltar"
            icon="pi pi-arrow-left"
            buttonClass="p-button-text"
            tooltip="Voltar à lista de tarefas"
            (clicked)="navigateToList()">
          </app-button>
          
          <app-button 
            label="Ver Detalhes"
            icon="pi pi-eye"
            buttonClass="p-button-text p-button-info"
            tooltip="Visualizar detalhes"
            (clicked)="navigateToDetail()"
            *ngIf="editTodo.id">
          </app-button>
        </div>

        <!-- Form -->
        <p-card class="shadow-lg rounded-lg" *ngIf="editTodo.id">
          <div class="flex flex-col gap-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input 
                id="title"
                type="text" 
                pInputText 
                [(ngModel)]="editTodo.title"
                placeholder="Digite o título da tarefa"
                class="w-full" />
            </div>
            
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <p-inputNumber
                id="priority"
                [(ngModel)]="editTodo.priority"
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
            
            <div>
              <label class="flex items-center gap-2">
                <p-checkbox 
                  [binary]="true"
                  [(ngModel)]="editTodo.completed">
                </p-checkbox>
                <span class="text-sm font-medium text-gray-700">Tarefa concluída</span>
              </label>
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
              label="Atualizar"
              icon="pi pi-save"
              buttonClass="p-button-warning"
              tooltip="Salvar alterações"
              (clicked)="updateTodo()">
            </app-button>
          </div>
        </p-card>

        <!-- Error State -->
        <p-card class="shadow-lg rounded-lg" *ngIf="!editTodo.id">
          <div class="text-center py-8">
            <div class="text-gray-500">
              <i class="pi pi-exclamation-triangle text-3xl mb-3 block text-red-500"></i>
              <p class="text-lg mb-2">Tarefa não encontrada</p>
              <p>A tarefa que você está procurando não existe ou foi removida.</p>
            </div>
          </div>
        </p-card>
      </div>
    </div>

    <!-- Toast para notificações -->
    <p-toast></p-toast>
  `
})
export class TodoEditPageComponent implements OnInit {
  editTodo: TodoItem = {
    id: 0,
    title: '',
    priority: 1,
    completed: false
  };

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private todoService = inject(TodoService);
  private messageService = inject(MessageService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Buscar tarefa do backend para edição
      this.todoService.getTodoByIdFromApi(id).subscribe({
        next: (response) => {
          console.log('✅ Tarefa carregada para edição:', response);
          this.editTodo = { ...response };
        },
        error: (error) => {
          console.error('❌ Erro ao carregar tarefa:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar a tarefa'
          });
        }
      });
    }
  }

  updateTodo() {
    if (!this.editTodo.title.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Título é obrigatório'
      });
      return;
    }

    // Atualizar tarefa no backend via API (usando PUT)
    this.todoService.updateTodoInApi(this.editTodo).subscribe({
      next: (response) => {
        console.log('✅ Tarefa atualizada no backend:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tarefa atualizada com sucesso'
        });

        // Aguarda um pouco para mostrar o toast antes de navegar
        setTimeout(() => {
          this.router.navigate(['/todos']);
        }, 1000);
      },
      error: (error) => {
        console.error('❌ Erro ao atualizar tarefa:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível atualizar a tarefa'
        });
      }
    });
  }

  navigateToList() {
    this.router.navigate(['/todos']);
  }

  navigateToDetail() {
    this.router.navigate(['/todos', this.editTodo.id]);
  }
}