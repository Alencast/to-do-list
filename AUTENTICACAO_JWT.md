# Autenticação JWT - To-Do List Application

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Backend (Django)](#backend-django)
3. [Frontend (Angular)](#frontend-angular)
4. [Fluxo Completo de Autenticação](#fluxo-completo-de-autenticação)
5. [Diagrama do Fluxo](#diagrama-do-fluxo)

---

## 🎯 Visão Geral

Este projeto implementa autenticação JWT (JSON Web Token) completa, protegendo rotas e requisições HTTP entre frontend (Angular) e backend (Django REST Framework). 

### Requisitos Implementados:
✅ Tela de login com usuário e senha  
✅ Serviço de autenticação JWT no backend  
✅ Guard (CanActivate) para proteção de rotas  
✅ Interceptor HTTP para envio automático do token JWT  

---

## 🔐 Backend (Django)

### Arquivos Envolvidos:
- `backend/backend/settings.py` - Configuração do JWT
- `backend/core/views.py` - Endpoint de login
- `backend/core/serializers.py` - Validação de dados
- `backend/core/urls.py` - Roteamento

### 1. Configuração do JWT (`settings.py`)

#### Pacotes Instalados:
```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework_simplejwt',  # Pacote JWT
    'corsheaders',               # CORS para Angular
    'core'
]
```

#### Configuração REST Framework:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```
**O que faz:** Define que todas as rotas da API usarão JWT como método padrão de autenticação.

#### Configuração dos Tokens JWT:
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),    # Token expira em 1 hora
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),    # Refresh token expira em 1 dia
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',                            # Algoritmo de criptografia
    'SIGNING_KEY': SECRET_KEY,                       # Chave para assinar tokens
    'AUTH_HEADER_TYPES': ('Bearer',),                # Tipo de autorização
}
```

#### CORS (Comunicação com Angular):
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',  # Permite requisições do Angular
]

CORS_ALLOW_HEADERS = [
    'authorization',  # Permite header Authorization com token
    'content-type',
    # ...
]
```

### 2. Endpoint de Login (`core/views.py`)

```python
class LoginView(views.APIView):
    permission_classes = [AllowAny]  # Permite acesso sem autenticação
    
    def post(self, request):
        # 1. Valida dados de entrada
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # 2. Autentica usuário no banco de dados
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # 3. Gera tokens JWT para o usuário
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            
            # 4. Retorna tokens e dados do usuário
            return Response({
                'access': str(refresh.access_token),  # Token de acesso
                'refresh': str(refresh),               # Token de renovação
                'user': user_serializer.data           # Dados do usuário
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Credenciais inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
```

**Fluxo:**
1. Recebe `username` e `password` via POST
2. Valida credenciais com `authenticate()`
3. Se válido, gera 2 tokens usando `RefreshToken.for_user()`:
   - **Access Token:** Usado nas requisições (expira em 1h)
   - **Refresh Token:** Usado para renovar access token (expira em 1 dia)
4. Retorna tokens + dados do usuário

### 3. Serializers (`core/serializers.py`)

```python
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)  # Não retorna senha
```
**Função:** Valida que username e password estão presentes.

```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']
```
**Função:** Serializa dados do usuário para retornar no login.

### 4. Roteamento (`core/urls.py`)

```python
urlpatterns = [ 
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),  # POST /api/auth/login/
]
```

### 5. Proteção Automática das Rotas

Como `REST_FRAMEWORK` define `JWTAuthentication` como padrão, **TODAS** as views do `TodoItemViewSet` exigem autenticação automaticamente:

```python
class TodoItemViewSet(viewsets.ModelViewSet):
    queryset = TodoItem.objects.all()
    # Requer token JWT no header Authorization: Bearer <token>
```

Se uma requisição for feita **sem** o token JWT, o Django retorna `401 Unauthorized`.

---

## 🎨 Frontend (Angular)

### Arquivos Envolvidos:
- `src/app/componentes/login/login.component.ts` - Tela de login
- `src/app/services/auth.service.ts` - Gerenciamento de autenticação
- `src/app/guards/auth.guard.ts` - Proteção de rotas
- `src/app/interceptors/auth.interceptor.ts` - Interceptação HTTP
- `src/app/app.routes.ts` - Configuração de rotas
- `src/app/app.config.ts` - Configuração da aplicação

### 1. Tela de Login (`login.component.ts`)

```typescript
export class Login {
  loginForm: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      
      // Chama serviço de autenticação
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/todos']);  // Redireciona após sucesso
        },
        error: (error) => {
          this.errorMessage.set('Erro ao fazer login');
        }
      });
    }
  }
}
```

**Fluxo:**
1. Usuário preenche username e password
2. Ao submeter, chama `authService.login()`
3. Se sucesso, redireciona para `/todos`
4. Se erro, exibe mensagem de erro

### 2. Serviço de Autenticação (`auth.service.ts`)

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  constructor(private http: HttpClient) {
    // Carrega token do localStorage ao inicializar
    const token = localStorage.getItem('access_token');
    if (token) {
      this.tokenSignal.set(token);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        // Salva tokens e usuário
        this.tokenSignal.set(response.access);
        this.currentUserSignal.set(response.user);
        localStorage.setItem('access_token', response.access);    // Persiste token
        localStorage.setItem('refresh_token', response.refresh);  // Persiste refresh
      })
    );
  }

  logout(): void {
    // Limpa autenticação
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');  // Usado pelo interceptor
  }
}
```

**Responsabilidades:**
1. **Login:** Envia credenciais para `/api/auth/login/`
2. **Armazenamento:** Salva tokens no `localStorage` (persiste mesmo fechando navegador)
3. **Gerenciamento:** Mantém estado do usuário com signals
4. **Logout:** Remove tokens e limpa estado
5. **Recuperação:** Fornece token para interceptor via `getToken()`

**Por que localStorage?**
- Persiste entre recarregamentos da página
- Acessível por todo o app
- Automaticamente incluído nas requisições pelo interceptor

### 3. Guard de Autenticação (`auth.guard.ts`)

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    return true;   // Permite acesso à rota
  } else {
    router.navigate(['/login']);  // Redireciona para login
    return false;  // Bloqueia acesso
  }
};
```

**Função:**
- Verifica se existe token JWT antes de permitir acesso à rota
- Se **não tem token:** Redireciona para `/login`
- Se **tem token:** Permite navegação

**Implementação:** É um guard funcional (Angular 15+) usando `CanActivateFn`.

### 4. Interceptor HTTP (`auth.interceptor.ts`)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Clona requisição e adiciona header Authorization
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // Formato esperado pelo backend
      }
    });
    return next(clonedRequest);  // Envia requisição modificada
  }

  return next(req);  // Envia requisição original (sem token)
};
```

**Função:**
- **Intercepta TODAS as requisições HTTP** antes de enviá-las
- Verifica se existe token no `localStorage`
- Se existe, adiciona header `Authorization: Bearer <token>`
- Funciona para GET, POST, PUT, PATCH, DELETE automaticamente

**Vantagem:** Não precisa adicionar token manualmente em cada requisição!

### 5. Configuração das Rotas (`app.routes.ts`)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./componentes/login/login.component').then(m => m.Login)
    // SEM guard - login é público
  },
  { 
    path: 'todos', 
    loadComponent: () => import('./pages/todo-list-page/todo-list-page.component').then(m => m.TodoListPage),
    canActivate: [authGuard]  // ✅ PROTEGIDO - requer autenticação
  },
  { 
    path: 'todos/new', 
    loadComponent: () => import('./pages/todo-create-page/todo-create-page.component').then(m => m.TodoCreatePage),
    canActivate: [authGuard]  // ✅ PROTEGIDO
  },
  { 
    path: 'todos/:id/edit', 
    loadComponent: () => import('./pages/todo-edit-page/todo-edit-page.component').then(m => m.TodoEditPage),
    canActivate: [authGuard]  // ✅ PROTEGIDO
  },
  { 
    path: 'todos/:id', 
    loadComponent: () => import('./pages/todo-detail-page/todo-detail-page.component').then(m => m.TodoDetailPage),
    canActivate: [authGuard]  // ✅ PROTEGIDO
  },
];
```

**Regra:** Todas as rotas de todos têm `canActivate: [authGuard]`, exceto `/login`.

### 6. Configuração Global (`app.config.ts`)

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),  // ✅ Registra interceptor
    // ...
  ]
};
```

**Importante:** O interceptor precisa ser registrado aqui para funcionar globalmente!

---

## 🔄 Fluxo Completo de Autenticação

### Cenário 1: Usuário Fazendo Login

```
1. USUÁRIO digita username e password no formulário
   ↓
2. ANGULAR (login.component.ts) chama authService.login()
   ↓
3. ANGULAR (auth.service.ts) faz POST http://localhost:8000/api/auth/login/
   ↓
4. DJANGO (LoginView) recebe requisição
   ↓
5. DJANGO valida credenciais com authenticate()
   ↓
6. DJANGO gera tokens JWT com RefreshToken.for_user()
   ↓
7. DJANGO retorna:
   {
     "access": "eyJ0eXAiOiJKV1QiLCJh...",  ← Access Token
     "refresh": "eyJ0eXAiOiJKV1QiLC...",  ← Refresh Token
     "user": { "id": 1, "username": "admin", ... }
   }
   ↓
8. ANGULAR (auth.service.ts) recebe resposta
   ↓
9. ANGULAR salva no localStorage:
   - access_token
   - refresh_token
   ↓
10. ANGULAR redireciona para /todos
```

### Cenário 2: Acessando Rota Protegida

```
1. USUÁRIO tenta acessar /todos
   ↓
2. ANGULAR (authGuard) verifica se existe token
   ↓
   SIM → Permite acesso
   NÃO → Redireciona para /login
```

### Cenário 3: Fazendo Requisição HTTP Protegida

```
1. COMPONENTE chama todoService.getTodos()
   ↓
2. ANGULAR faz GET http://localhost:8000/api/todos/
   ↓
3. INTERCEPTOR (auth.interceptor.ts) intercepta requisição
   ↓
4. INTERCEPTOR adiciona header:
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJh...
   ↓
5. DJANGO recebe requisição
   ↓
6. DJANGO (JWTAuthentication) valida token:
   - Verifica assinatura
   - Verifica expiração
   - Identifica usuário
   ↓
   VÁLIDO → Retorna dados
   INVÁLIDO → Retorna 401 Unauthorized
```

### Cenário 4: Token Expirado

```
1. USUÁRIO tenta requisição com token expirado
   ↓
2. DJANGO retorna 401 Unauthorized
   ↓
3. ANGULAR pode:
   - Usar refresh_token para gerar novo access_token (não implementado)
   - Redirecionar para login (comportamento atual)
```

---

## 📊 Diagrama do Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Angular)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐                                          │
│  │ Login Component  │                                          │
│  │  - username      │                                          │
│  │  - password      │                                          │
│  └────────┬─────────┘                                          │
│           │ onSubmit()                                          │
│           ↓                                                      │
│  ┌──────────────────┐      localStorage                        │
│  │  Auth Service    │◄─────► [access_token]                    │
│  │  - login()       │        [refresh_token]                   │
│  │  - logout()      │                                          │
│  │  - getToken()    │                                          │
│  └────────┬─────────┘                                          │
│           │                                                      │
│           ├─────────► ┌──────────────────┐                     │
│           │           │  Auth Guard      │                     │
│           │           │  - verifica token│                     │
│           │           │  - protege rotas │                     │
│           │           └──────────────────┘                     │
│           │                                                      │
│           └─────────► ┌──────────────────┐                     │
│                       │ Auth Interceptor │                     │
│                       │ - adiciona header│                     │
│                       │   Authorization  │                     │
│                       └────────┬─────────┘                     │
└────────────────────────────────┼─────────────────────────────┘
                                 │
                    HTTP Request │ Authorization: Bearer <token>
                                 │
┌────────────────────────────────┼──────────────────────────────┐
│                                ↓                               │
│                        BACKEND (Django)                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐                                          │
│  │   LoginView      │                                          │
│  │  POST /auth/login│                                          │
│  │  - authenticate()│                                          │
│  │  - gera tokens   │                                          │
│  └──────────────────┘                                          │
│           │                                                      │
│           ↓                                                      │
│  ┌──────────────────┐                                          │
│  │ RefreshToken     │                                          │
│  │  - for_user()    │                                          │
│  │  - access_token  │ (expira 1h)                             │
│  │  - refresh_token │ (expira 1 dia)                          │
│  └──────────────────┘                                          │
│           │                                                      │
│           ↓                                                      │
│  ┌──────────────────┐                                          │
│  │ JWTAuthentication│                                          │
│  │  - valida token  │                                          │
│  │  - identifica user│                                         │
│  └──────────────────┘                                          │
│           │                                                      │
│           ↓                                                      │
│  ┌──────────────────┐                                          │
│  │ TodoItemViewSet  │                                          │
│  │  - requer auth   │                                          │
│  │  - CRUD todos    │                                          │
│  └──────────────────┘                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Resumo dos Componentes

| Componente | Arquivo | Função |
|------------|---------|--------|
| **Backend - Configuração JWT** | `backend/settings.py` | Define algoritmo, expiração, tipo de header |
| **Backend - Endpoint Login** | `core/views.py` → `LoginView` | Autentica usuário e gera tokens JWT |
| **Backend - Validação** | `core/serializers.py` | Valida dados de login e serializa usuário |
| **Backend - Proteção** | `REST_FRAMEWORK` → `JWTAuthentication` | Valida token em todas requisições |
| **Frontend - Tela Login** | `login.component.ts` | Formulário de login |
| **Frontend - Gerenciamento Auth** | `auth.service.ts` | Login, logout, armazenamento de tokens |
| **Frontend - Proteção Rotas** | `auth.guard.ts` | Bloqueia rotas sem autenticação |
| **Frontend - Envio Token** | `auth.interceptor.ts` | Adiciona token em todas requisições HTTP |

---

## 🎯 Conclusão

O sistema implementa os 4 requisitos completamente:

1. ✅ **Tela de Login:** `login.component.ts` com formulário reativo
2. ✅ **Serviço JWT Backend:** `LoginView` com `rest_framework_simplejwt`
3. ✅ **Guard (CanActivate):** `authGuard` protege rotas de todos
4. ✅ **Interceptor HTTP:** `authInterceptor` adiciona `Authorization: Bearer <token>` automaticamente

O fluxo é completo e seguro:
- Tokens são gerados no backend com criptografia HS256
- Tokens são armazenados no localStorage do navegador
- Rotas são protegidas antes da navegação
- Requisições HTTP incluem token automaticamente
- Backend valida token em todas operações CRUD
