import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo-item.model';
import { Button } from '../../componentes/button/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-todo-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    CardModule
  ],
  template: `
    <div class="min-h-screen bg-blue-50 p-4">
      <div class="container mx-auto max-w-4xl">
        <h1 class="text-3xl font-bold mb-4">Detalhes da Tarefa</h1>
        
        <div class="mb-4">
          <app-button 
            label="Voltar"
            icon="pi pi-arrow-left"
            buttonClass="p-button-text"
            (clicked)="navigateToList()">
          </app-button>
          
          <app-button 
            label="Editar"
            icon="pi pi-pencil"
            buttonClass="p-button-warning"
            (clicked)="navigateToEdit()"
            *ngIf="todo()">
          </app-button>
        </div>

        <p-card *ngIf="todo()" class="shadow-lg">
          <div class="space-y-4">
            <div>
              <label class="font-medium">ID:</label>
              <p>{{ todo()?.id }}</p>
            </div>
            
            <div>
              <label class="font-medium">Título:</label>
              <p class="text-xl font-semibold">{{ todo()?.title }}</p>
            </div>
            
            <div>
              <label class="font-medium">Prioridade:</label>
              <span class="px-3 py-1 rounded text-sm">
                {{ getPriorityLabel(todo()?.priority || 1) }}
              </span>
            </div>
            
            <div>
              <label class="font-medium">Status:</label>
              <span class="px-3 py-1 rounded text-sm">
                {{ todo()?.completed ? 'Concluída' : 'Pendente' }}
              </span>
            </div>
          </div>
        </p-card>

        <p-card *ngIf="!todo()" class="shadow-lg">
          <div class="text-center py-8">
            <h2 class="text-lg mb-2">Tarefa não encontrada</h2>
            <p>A tarefa que você está procurando não existe.</p>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class TodoDetailPage implements OnInit {
  // SIGNAL: Estado local do componente - armazena a tarefa carregada
  // Quando .set() é chamado, o template é atualizado automaticamente
  protected todo = signal<TodoItem | null>(null);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private todoService = inject(TodoService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // Buscar tarefa do backend via API
      this.todoService.getTodoByIdFromApi(id).subscribe({
        next: (response) => {
          console.log('Tarefa carregada do backend:', response);
          this.todo.set(response);
        },
        error: (error) => {
          console.error('Erro ao carregar tarefa:', error);
          this.todo.set(null);
        }
      });
    }
  }

  navigateToList() {
    this.router.navigate(['/todos']);
  }

  navigateToEdit() {
    const currentTodo = this.todo();
    if (currentTodo) {
      this.router.navigate(['/todos', currentTodo.id, 'edit']);
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
      case 1: return 'red';
      case 2: return 'yellow';
      case 3: return 'green';
      default: return 'blue';
    }
  }
}