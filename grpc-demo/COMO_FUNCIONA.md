# Como o gRPC Funciona Nesta Aplicação

## O Que é gRPC?

gRPC é um framework de comunicação que usa **Protocol Buffers** (binário) ao invés de JSON. É mais rápido e eficiente que REST APIs tradicionais.

**Diferença:**
- 🔴 **REST**: HTTP → JSON → `GET /api/todos/`
- 🟢 **gRPC**: TCP → Binary (Protobuf) → `TodoService.ListTodos()`

---

## Arquivos Envolvidos

### 1. `grpc-demo/hello.proto`
**O que faz:** Define a estrutura de dados e serviços em Protocol Buffers.

```protobuf
service TodoService {
  rpc ListTodos (Empty) returns (TodoList);
}
```

- Define o **serviço** `TodoService` com método `ListTodos`
- Define as **mensagens**: `Todo`, `TodoList`, `Empty`
- É a "interface" do seu gRPC (como um contrato)

---

### 2. `hello_pb2.py` (GERADO AUTOMATICAMENTE)
**O que faz:** Classes Python das mensagens definidas no `.proto`.

**Como é criado:**
```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```

Contém:
- Classe `Todo` (id, title, priority, completed)
- Classe `TodoList` (lista de todos + count)
- Classe `Empty`

**⚠️ NÃO edite este arquivo!** É gerado automaticamente.

---

### 3. `hello_pb2_grpc.py` (GERADO AUTOMATICAMENTE)
**O que faz:** Código do servidor e cliente gRPC.

Contém:
- `TodoServiceServicer` - Classe base para implementar o servidor
- `TodoServiceStub` - Cliente para fazer chamadas
- Funções de registro do servidor

**⚠️ NÃO edite este arquivo!** É gerado automaticamente.

---

### 4. `grpc-demo/server.py`
**O que faz:** Servidor gRPC que acessa o banco de dados Django.

**Fluxo:**
1. Configura Django para acessar o banco
2. Implementa `TodoServiceServicer` com método `ListTodos`
3. Busca todos os `TodoItem` do banco Django
4. Converte para mensagens Protobuf
5. Retorna `TodoList` com os dados

**Porta:** 50051 (padrão gRPC)

---

### 5. `grpc-demo/client.py`
**O que faz:** Cliente que faz requisição gRPC ao servidor.

**Fluxo:**
1. Conecta ao servidor gRPC em `localhost:50051`
2. Cria um `stub` (proxy do serviço)
3. Chama `stub.ListTodos(Empty())`
4. Recebe `TodoList` com os dados
5. Exibe no terminal formatado

---

## Como Funciona (Passo a Passo)

### 1️⃣ Geração dos Arquivos
```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```
- Lê `hello.proto`
- Gera `hello_pb2.py` (mensagens)
- Gera `hello_pb2_grpc.py` (serviço)

### 2️⃣ Servidor Inicia
```bash
python server.py
```
- Importa `hello_pb2` e `hello_pb2_grpc`
- Registra o serviço `TodoServiceServicer`
- Escuta na porta **50051**
- Aguarda requisições

### 3️⃣ Cliente Faz Requisição
```bash
python client.py
```
- Conecta ao servidor via gRPC
- Envia `Empty()` (mensagem vazia)
- Servidor processa e busca no banco Django
- Retorna `TodoList` em formato binário (Protobuf)
- Cliente recebe e desserializa
- Exibe no terminal

---

## Fluxo Completo

```
┌──────────────┐                  ┌──────────────┐                  ┌──────────────┐
│              │  gRPC Binary     │              │  Django ORM      │              │
│   Client     │ ───────────────> │   Server     │ ───────────────> │   Database   │
│  client.py   │   ListTodos()    │  server.py   │   TodoItem.all() │  db.sqlite3  │
│              │ <─────────────── │              │ <─────────────── │              │
└──────────────┘  TodoList Proto  └──────────────┘   QuerySet       └──────────────┘
```

---

## Por Que É Mais Rápido que REST?

| Aspecto | REST | gRPC |
|---------|------|------|
| **Formato** | JSON (texto) | Protobuf (binário) |
| **Tamanho** | ~1KB | ~500 bytes |
| **Parse** | JSON.parse() | Desserialização binária |
| **HTTP** | HTTP/1.1 | HTTP/2 |
| **Streaming** | ❌ | ✅ |

---

## Resumo dos Arquivos

| Arquivo | Tipo | Função |
|---------|------|--------|
| `hello.proto` | Definição | Define serviços e mensagens |
| `hello_pb2.py` | Gerado | Classes das mensagens |
| `hello_pb2_grpc.py` | Gerado | Servidor e cliente gRPC |
| `server.py` | Implementação | Servidor que acessa Django |
| `client.py` | Implementação | Cliente de teste |

---

## Comandos Essenciais

```bash
# Gerar arquivos (uma vez)
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto

# Terminal 1 - Servidor
python server.py

# Terminal 2 - Cliente
python client.py
```

---

## Estrutura de Pastas

```
grpc-demo/
├── hello.proto              # Definição Protocol Buffers
├── hello_pb2.py             # GERADO - Mensagens
├── hello_pb2_grpc.py        # GERADO - Serviço gRPC
├── server.py                # Servidor gRPC + Django
├── client.py                # Cliente de teste
└── README.md                # Instruções
```

---

## Conclusão

✅ **É gRPC de verdade** - Comunicação binária via Protobuf  
✅ **Conecta ao Django** - Acessa o mesmo banco da API REST  
✅ **Mais eficiente** - Mensagens menores e mais rápidas  
✅ **Independente** - Roda na porta 50051, não usa REST  

O servidor gRPC convive com a API REST. Ambos acessam o mesmo banco Django!
