# 🚀 Guia de Execução - Todo List com gRPC

## 📋 Pré-requisitos

- Python 3.8+
- Node.js 18+
- Git

---

## 🔧 Instalação (Primeira Vez)

### 1. Clonar/Baixar o Projeto
```bash
cd to-do-list
```

### 2. Criar Ambiente Virtual Python (IMPORTANTE!)
```bash
python -m venv .venv
```

### 3. Ativar o Ambiente Virtual

**Windows (Git Bash):**
```bash
source .venv/Scripts/activate
```

**Windows (CMD):**
```bash
.venv\Scripts\activate
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

**✅ Você deve ver `(.venv)` no início da linha do terminal**

### 4. Instalar Dependências Python
```bash
cd backend
pip install -r requirements.txt
pip install grpcio grpcio-tools
cd ..
```

### 5. Instalar Dependências Node.js
```bash
cd ToDoList
npm install
cd ..
```

### 6. Gerar Arquivos gRPC (uma vez)
```bash
cd grpc-demo
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
cd ..
```

---

## ▶️ Executar a Aplicação

### Opção A: Executar Tudo Separadamente (Recomendado)

Você precisa de **4 terminais** diferentes:

#### Terminal 1 - Servidor gRPC
```bash
source .venv/Scripts/activate  # Ativar ambiente
cd grpc-demo
python server.py
```
**Porta:** 50051

#### Terminal 2 - Backend Django
```bash
source .venv/Scripts/activate  # Ativar ambiente
cd backend
python manage.py runserver
```
**Porta:** 8000

#### Terminal 3 - Frontend Angular
```bash
cd ToDoList
npm start
```
**Porta:** 4200

#### Terminal 4 - Testar gRPC (quando quiser)
```bash
source .venv/Scripts/activate  # Ativar ambiente
cd grpc-demo
python client.py
```

---

## 🌐 URLs de Acesso

- **Frontend:** http://localhost:4200
- **API REST:** http://localhost:8000/api/todos/
- **Django Admin:** http://localhost:8000/admin/
- **gRPC Server:** localhost:50051 (não tem interface web)

---

## 🧪 Testar o gRPC

1. Certifique-se que o **Servidor gRPC** está rodando (Terminal 1)
2. Cadastre alguns todos pelo **Frontend** (http://localhost:4200)
3. Execute o cliente gRPC:
   ```bash
   source .venv/Scripts/activate
   cd grpc-demo
   python client.py
   ```

**Resultado esperado:**
```
📋 Total de Todos: 2

✓ [1] Comprar pão
   Prioridade: Alta

○ [2] Estudar Python
   Prioridade: Média
```

---

## ⚠️ Problemas Comuns

### Erro: "ModuleNotFoundError: No module named 'django'"
**Solução:** Ative o ambiente virtual!
```bash
source .venv/Scripts/activate  # Windows Git Bash
```

### Erro: "No module named 'hello_pb2'"
**Solução:** Gere os arquivos gRPC:
```bash
cd grpc-demo
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```

### Erro: "Port 8000 is already in use"
**Solução:** Mate o processo anterior:
```bash
# Windows
taskkill /F /IM python.exe

# Linux/Mac
pkill python
```

### Erro: "npm ERR!"
**Solução:** Limpe o cache e reinstale:
```bash
cd ToDoList
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Estrutura do Projeto

```
to-do-list/
├── .venv/                    # Ambiente virtual Python (criado na instalação)
├── backend/                  # Django REST API
│   ├── core/                 # App principal
│   ├── manage.py
│   └── requirements.txt
├── ToDoList/                 # Frontend Angular
│   ├── src/
│   ├── package.json
│   └── angular.json
├── grpc-demo/                # Servidor e Cliente gRPC
│   ├── hello.proto           # Definição Protocol Buffers
│   ├── server.py             # Servidor gRPC
│   ├── client.py             # Cliente de teste
│   ├── hello_pb2.py          # Gerado automaticamente
│   └── hello_pb2_grpc.py     # Gerado automaticamente
└── START_GUIDE.md            # Este arquivo
```

---

## 🎓 Para o Professor

### Executar Rápido (Resumo)

```bash
# 1. Criar e ativar ambiente virtual
python -m venv .venv
source .venv/Scripts/activate

# 2. Instalar dependências
cd backend && pip install -r requirements.txt && pip install grpcio grpcio-tools && cd ..
cd ToDoList && npm install && cd ..

# 3. Gerar arquivos gRPC
cd grpc-demo && python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto && cd ..

# 4. Rodar (em terminais separados)
# Terminal 1: cd grpc-demo && python server.py
# Terminal 2: cd backend && python manage.py runserver
# Terminal 3: cd ToDoList && npm start
# Terminal 4: cd grpc-demo && python client.py
```

### O Que Avaliar no gRPC

1. ✅ Arquivo `.proto` define serviço e mensagens
2. ✅ Servidor gRPC conecta ao banco Django
3. ✅ Cliente faz requisição binária (não é REST)
4. ✅ Dados trafegam via Protocol Buffers
5. ✅ Porta diferente do REST (50051 vs 8000)

---

## 📚 Documentação Adicional

- **Como o gRPC funciona:** Ver `grpc-demo/COMO_FUNCIONA.md`
- **Comandos individuais:** Ver `START_GUIDE.md`

---

## ✅ Checklist de Execução

- [ ] Ambiente virtual criado e ativado
- [ ] Dependências Python instaladas
- [ ] Dependências Node instaladas
- [ ] Arquivos gRPC gerados
- [ ] Servidor gRPC rodando (porta 50051)
- [ ] Django rodando (porta 8000)
- [ ] Angular rodando (porta 4200)
- [ ] Cliente gRPC testado com sucesso

---

## 💡 Dica Final

**SEMPRE ative o ambiente virtual antes de rodar Python!**

```bash
source .venv/Scripts/activate
```

Você saberá que está ativo quando ver `(.venv)` no início da linha do terminal.
