# Guia de Apresentação - To-Do List

## 📋 Funcionalidades Implementadas

- ✅ Tela de login com usuário e senha
- ✅ Serviço de autenticação JWT no backend
- ✅ Guard (CanActivate) para proteção de rotas
- ✅ Interceptor HTTP para envio automático do token JWT

---

## 🔐 Sistema de Autenticação JWT

### Backend (Django)

#### `backend/backend/settings.py` - Configuração do JWT
**O que faz:** Define que todas as rotas da API usarão JWT como método padrão de autenticação.

#### `backend/core/views.py` - Endpoint de login
**O que faz:**
- Recebe `username` e `password` via POST
- Valida credenciais com `authenticate()`
- Se válido, gera 2 tokens usando `RefreshToken.for_user()`:
  - **Access Token:** Usado nas requisições (expira em 1h)
  - **Refresh Token:** Usado para renovar access token (expira em 1 dia)
- Retorna tokens + dados do usuário

#### `backend/core/serializers.py` - Validação de dados
#### `backend/core/urls.py` - Roteamento

**💡 Importante:** Como `REST_FRAMEWORK` define `JWTAuthentication` como padrão, TODAS as views do `TodoItemViewSet` exigem autenticação automaticamente.

---

### Frontend (Angular)

#### `src/app/componentes/login/login.component.ts` - Tela de login
**O que faz:** Formulário com campos de username e password. Ao submeter, chama `authService.login()` e redireciona para `/todos` em caso de sucesso.

#### `src/app/services/auth.service.ts` - Gerenciamento de autenticação
**O que faz:**
- `login()`: Envia POST para `/api/auth/login/` e armazena tokens no localStorage
- `logout()`: Remove tokens e redireciona para `/login`
- `getAccessToken()`: Retorna o access token armazenado
- `isAuthenticated()`: Verifica se usuário está logado (checa se token existe)

#### `src/app/guards/auth.guard.ts` - Proteção de rotas
**O que faz:** Implementa `canActivate()`. Bloqueia acesso às rotas protegidas se usuário não estiver autenticado, redirecionando para `/login`.

#### `src/app/interceptors/auth.interceptor.ts` - Interceptação HTTP
**O que faz:** Intercepta TODAS as requisições HTTP e adiciona automaticamente o header `Authorization: Bearer {token}` se o usuário estiver logado.

#### `src/app/app.routes.ts` - Configuração de rotas
**O que faz:** Define rotas da aplicação. Rotas `/todos` usam `canActivate: [authGuard]` para exigir autenticação. Rota `/login` é pública.

#### `src/app/app.config.ts` - Configuração da aplicação
**O que faz:** Registra interceptor e providers globais. O `withInterceptors([authInterceptor])` ativa o interceptor JWT em toda aplicação.

---

## ⚡ Signals no Angular 21

### Para Que Servem
Signals são uma nova forma **reativa** de gerenciar estado no Angular. Substituem o uso excessivo de RxJS/Observables para dados síncronos, tornando o código mais simples e performático.

### Como São Usados na Aplicação

#### 1️⃣ **Gerenciamento de Estado Global** - `todo.service.ts`
**O que faz:** 
- `private todos = signal<TodoItem[]>([])` - Armazena lista de tarefas
- Qualquer mudança no signal atualiza automaticamente todos os componentes que o leem
- Métodos como `addTodo()`, `updateTodo()`, `deleteTodo()` usam `.set()` para atualizar o estado

#### 2️⃣ **State Local de Componentes** - `todo-detail-page.component.ts` e `todo-edit-page.component.ts`
**O que faz:**
- `todo = signal<TodoItem | null>(null)` - Armazena tarefa atual
- `editTodo = signal<TodoItem | null>(null)` - Armazena tarefa em edição
- Usado no template com `todo()` - atualiza automaticamente a UI quando muda

#### 3️⃣ **Signal Forms** - `todo-create-page.component.ts` e `todo-edit-page.component.ts`
**O que faz:**
- `initialModel = signal({...})` - Estado inicial do formulário
- `todoForm = form(initialModel, validações)` - Cria formulário reativo com signals
- Validações automáticas: `REQUIRED`, `MIN`, `MAX`
- `todoForm().invalid()` - Computed signal que valida em tempo real
- `todoForm().value()` - Extrai valores atualizados

**💡 Vantagem:** Sem necessidade de `FormBuilder`, `FormGroup`, ou `FormControl` do Reactive Forms tradicional. Mais simples e direto.