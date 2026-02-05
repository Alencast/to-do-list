# Como o gRPC Funciona Nesta Aplicação

## O Que é gRPC?

gRPC é uma forma de comunicação entre programas que é **mais rápida** que REST APIs.

**Diferença principal:**
- **REST**: Você manda dados em formato JSON (texto), tipo `{"title": "Fazer compras"}`
- **gRPC**: Você manda dados em formato binário (0s e 1s compactados), muito menor e mais rápido

É como a diferença entre mandar uma carta escrita à mão vs mandar um arquivo zipado.

---

## Os Arquivos e O Que Cada Um Faz

### 1. `hello.proto` - O Contrato

Este arquivo é onde você **define** o que vai enviar e receber. É como um contrato que o cliente e servidor precisam respeitar.

**O que tem nele:**
```protobuf
service TodoService {
  rpc ListTodos (Empty) returns (TodoList);
}

message Todo {
  int32 id = 1;
  string title = 2;
  string priority = 3;
  bool completed = 4;
}
```

**Traduzindo:**
- Tem um serviço chamado `TodoService`
- Esse serviço tem um método `ListTodos`
- O método recebe "nada" (Empty) e devolve uma lista de Todos
- Cada Todo tem id, título, prioridade e se está completo

---

### 2. `hello_pb2.py` - Classes Geradas (NÃO MEXA)

Depois de criar o `.proto`, você roda um comando que **gera automaticamente** este arquivo.

**O que tem:**
- Classes Python das mensagens: `Todo`, `TodoList`, `Empty`
- Código para converter entre Python e formato binário

**⚠️ IMPORTANTE:** Nunca edite este arquivo manualmente! Ele é sempre gerado automaticamente.

---

### 3. `hello_pb2_grpc.py` - Servidor/Cliente Gerado (NÃO MEXA)

Este também é **gerado automaticamente** junto com o anterior.

**O que tem:**
- `TodoServiceServicer` - Base para criar o servidor
- `TodoServiceStub` - Base para criar o cliente
- Código para fazer a comunicação gRPC funcionar

**⚠️ IMPORTANTE:** Nunca edite este arquivo manualmente!

---

### 4. `server.py` - O Servidor Que Você Criou

Este é o arquivo que **você escreve**. Ele pega os arquivos gerados e implementa a lógica.

**O que ele faz:**
1. Conecta no banco de dados Django (aquele `db.sqlite3`)
2. Quando alguém chama `ListTodos`:
   - Busca todos os Todos do banco
   - Converte cada um para o formato Protobuf
   - Devolve a lista completa
3. Fica escutando na porta **50051** esperando requisições

**Código principal:**
```python
class TodoServiceServicer(hello_pb2_grpc.TodoServiceServicer):
    def ListTodos(self, request, context):
        # Busca no banco Django
        todos = TodoItem.objects.all()
        
        # Converte para Protobuf
        todo_list = []
        for todo in todos:
            todo_list.append(hello_pb2.Todo(
                id=todo.id,
                title=todo.title,
                # ...
            ))
        
        return hello_pb2.TodoList(todos=todo_list)
```

---

### 5. `client.py` - O Cliente de Teste

Este arquivo **testa** se o servidor está funcionando.

**O que ele faz:**
1. Conecta no servidor gRPC (localhost:50051)
2. Chama o método `ListTodos()`
3. Recebe a lista de Todos
4. Mostra bonitinho no terminal

**Código principal:**
```python
# Conecta
channel = grpc.insecure_channel('localhost:50051')
stub = hello_pb2_grpc.TodoServiceStub(channel)

# Faz a chamada
response = stub.ListTodos(hello_pb2.Empty())

# Mostra os resultados
for todo in response.todos:
    print(f"- {todo.title}")
```

---

## Como Rodar (Passo a Passo)

### Passo 1: Gerar os Arquivos (só precisa fazer UMA vez)

```bash
cd grpc-demo
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```

Isso vai criar/atualizar os arquivos `hello_pb2.py` e `hello_pb2_grpc.py`.

---

### Passo 2: Rodar o Servidor

Abra um terminal e rode:

```bash
cd grpc-demo
python server.py
```

Você vai ver: `Servidor gRPC rodando na porta 50051...`

Deixe esse terminal aberto! O servidor precisa ficar rodando.

---

### Passo 3: Rodar o Cliente

Abra **OUTRO terminal** e rode:

```bash
cd grpc-demo
python client.py
```

Você vai ver a lista de Todos que estão no banco!

---

## Fluxo Completo (Visual)

```
CLIENTE (client.py)                SERVIDOR (server.py)               BANCO (Django)
       │                                    │                              │
       │  1. ListTodos()                   │                              │
       │ ──────────────────────────────>   │                              │
       │      (formato binário)             │                              │
       │                                    │  2. TodoItem.objects.all()  │
       │                                    │ ──────────────────────────> │
       │                                    │                              │
       │                                    │  3. Retorna QuerySet        │
       │                                    │ <────────────────────────── │
       │                                    │                              │
       │                                    │  4. Converte para Protobuf  │
       │                                    │                              │
       │  5. TodoList                       │                              │
       │ <──────────────────────────────   │                              │
       │      (formato binário)             │                              │
       │                                    │                              │
       │  6. Mostra no terminal            │                              │
```

---

## Por Que gRPC é Mais Rápido?

| Aspecto | REST (JSON) | gRPC (Protobuf) |
|---------|-------------|-----------------|
| **Formato** | Texto: `{"id": 1, "title": "..."}` | Binário: `0x0A 0x10 0x01...` |
| **Tamanho** | ~1000 bytes | ~500 bytes (metade!) |
| **Processar** | Precisa ler o texto e interpretar | Já vem no formato que o programa entende |
| **Protocolo** | HTTP/1.1 (uma requisição por vez) | HTTP/2 (várias ao mesmo tempo) |

**Resumo:** É como a diferença entre escrever uma carta à mão (REST) vs enviar um arquivo compactado (gRPC).

---

## Resumo Final

1. **`hello.proto`** → Você escreve o "contrato" do que vai enviar/receber
2. **Rodar comando** → Gera automaticamente `hello_pb2.py` e `hello_pb2_grpc.py`
3. **`server.py`** → Você implementa a lógica (buscar no banco e retornar)
4. **`client.py`** → Você faz chamadas para testar

**Vantagens:**
- ✅ Mais rápido que REST (mensagens menores)
- ✅ Menos processamento (formato binário)
- ✅ Pode fazer streaming (enviar dados em tempo real)
- ✅ Funciona junto com a API REST (ambos acessam o mesmo banco Django)

---

## Dica

O servidor gRPC (porta 50051) funciona **junto** com a API REST do Django (porta 8000). 

São duas formas diferentes de acessar os mesmos dados!
