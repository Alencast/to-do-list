import { Injectable, signal } from '@angular/core';
import { TodoItem } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos = signal<TodoItem[]>([
    { id: 1, title: 'Completar projeto Angular', priority: 1, completed: false },
    { id: 2, title: 'Estudar PrimeNG', priority: 2, completed: true },
    { id: 3, title: 'Implementar Tailwind CSS', priority: 3, completed: false }
  ]);

  constructor() { }

  // Listar todos os to dos
  getTodos() {
    return this.todos.asReadonly();
  }

  // Detalhar um todo específico
  getTodoById(id: number): TodoItem | undefined {
    return this.todos().find(todo => todo.id === id);
  }

  // Inserir novo todo
  addTodo(todo: Omit<TodoItem, 'id'>): TodoItem {
    const newId = Math.max(...this.todos().map(t => t.id), 0) + 1;
    const newTodo: TodoItem = { ...todo, id: newId };
    this.todos.set([...this.todos(), newTodo]);
    return newTodo;
  }

  // Atualizar todo existente
  updateTodo(updatedTodo: TodoItem): boolean {
    const currentTodos = this.todos();
    const index = currentTodos.findIndex(t => t.id === updatedTodo.id);
    
    if (index !== -1) {
      currentTodos[index] = { ...updatedTodo };
      this.todos.set([...currentTodos]);
      return true;
    }
    
    return false;
  }

  // Remover todo
  deleteTodo(id: number): boolean {
    const currentTodos = this.todos();
    const initialLength = currentTodos.length;
    const filteredTodos = currentTodos.filter(t => t.id !== id);
    
    if (filteredTodos.length !== initialLength) {
      this.todos.set(filteredTodos);
      return true;
    }
    
    return false;
  }

  // deleteTodo(todo: TodoItem) {
  //   this.confirmationService.confirm({
  //     message: `Tem certeza que deseja excluir "${todo.title}"?`,
  //     header: 'Confirmar Exclusão',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.todos.set(this.todos().filter(t => t.id !== todo.id));
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Sucesso',
  //         detail: 'Item excluído com sucesso'
  //       });
  //     }
  //   });

  // Alternar status de conclusão
  toggleCompleted(id: number): boolean {
    const currentTodos = this.todos();
    const index = currentTodos.findIndex(t => t.id === id);
    
    if (index !== -1) {
      currentTodos[index].completed = !currentTodos[index].completed;
      this.todos.set([...currentTodos]);
      return true;
    }
    
    return false;
  }

  // Obter contagem de todos concluídos
  getCompletedCount(): number {
    return this.todos().filter(todo => todo.completed).length;
  }

  // Obter total de todos
  getTotalCount(): number {
    return this.todos().length;
  }
}