import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoItem } from '../models/todo-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8000/api/todos';
  
  // SIGNAL: Estado global reativo - qualquer mudança aqui atualiza todos os componentes automaticamente
  // Substitui Subject/BehaviorSubject do RxJS para gerenciamento de estado síncrono
  private todos = signal<TodoItem[]>([
    { id: 1, title: 'Completar projeto Angular', priority: 1, completed: false },
    { id: 2, title: 'Estudar PrimeNG', priority: 2, completed: true },
    { id: 3, title: 'Implementar Tailwind CSS', priority: 3, completed: false }
  ]);

  constructor(private http: HttpClient) { }

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

  // ===== MÉTODOS API DJANGO REST =====
  
  // Carregar todos do backend e atualizar o signal local
  loadTodosFromApi(): void {
    this.http.get<TodoItem[]>(this.apiUrl + '/').subscribe({
      next: (response) => {
        console.log('Tarefas carregadas do backend:', response);
        this.todos.set(response);
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
      }
    });
  }
  
  // Testar conexão com API Django
  testApiConnection(): void {
    console.log('🔄 Testando conexão com Django REST API...');
    this.http.get<{message: string}>(this.apiUrl + '/teste/').subscribe({
      next: (response) => {
        console.log('✅ Conexão bem-sucedida!');
        console.log('📦 Resposta do servidor:', response);
        console.log('💬 Mensagem:', response.message);
      },
      error: (error) => {
        console.error('❌ Erro ao conectar com a API:', error);
        console.error('Detalhes:', error.message);
      }
    });
  }

  // Buscar todos da API
  getTodosFromApi(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl + '/');
  }

  // Buscar todo por ID da API
  getTodoByIdFromApi(id: number): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${this.apiUrl}/${id}/`);
  }

  // Criar todo na API
  createTodoInApi(todo: Omit<TodoItem, 'id'>): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl + '/', todo);
  }

  // Atualizar todo na API
  updateTodoInApi(todo: TodoItem): Observable<TodoItem> {
    return this.http.put<TodoItem>(`${this.apiUrl}/${todo.id}/`, todo);
  }

  // Deletar todo na API
  deleteTodoFromApi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  // Toggle status na API
  toggleTodoInApi(id: number): Observable<TodoItem> {
    return this.http.patch<TodoItem>(`${this.apiUrl}/${id}/toggle/`, {});
  }
}