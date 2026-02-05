# Como Rodar o Cliente gRPC

Este guia mostra como configurar e rodar o cliente gRPC em um PC novo que acabou de clonar o repositório e tem apenas o Python instalado.

---

## Pré-requisitos

- Python 3.8 ou superior instalado
- Repositório clonado
- Ter o IP do servidor gRPC disponível

---

## Passo a Passo

### 1. Verificar Instalação do Python
```bash
python --version
```

Se não aparecer a versão do Python, baixe em: https://www.python.org/downloads/

**IMPORTANTE:** Marque "Add Python to PATH" durante a instalação.

### 2. Navegar até a Pasta do Projeto
```bash
cd caminho/para/to-do-list/grpc-demo
```

### 3. Instalar Dependências do gRPC
```bash
pip install grpcio grpcio-tools
```

### 4. Gerar os Arquivos Proto
```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```

Este comando gera os arquivos `hello_pb2.py` e `hello_pb2_grpc.py` necessários para o cliente.

### 5. Rodar o Cliente

**Opção 1: Modo interativo (recomendado)**
```bash
python client.py
```
- Escolha a opção **1** para testar localmente, ou
- Escolha a opção **2** para conectar a um servidor remoto
- Digite o **IP do servidor** (ex: `192.168.1.100`)
- Digite a porta: **50051** (ou apenas Enter para usar a padrão)

**Opção 2: Passar o IP direto na linha de comando**
```bash
python client.py 192.168.1.100:50051
```
(Substitua pelo IP real do servidor)

**Opção 3: Testar localmente**
```bash
python client.py localhost:50051
```
ou
```bash
python client.py 127.0.0.1:50051
```

### 6. Resultado Esperado
Se a conexão for bem-sucedida, você verá algo como:
```
Conectando ao servidor: 192.168.1.100:50051

Total de Todos: 3

[1] Teste 1
   Prioridade: Alta

[2] Teste 2
   Prioridade: Média

[3] Teste 3
   Prioridade: Baixa
```

---

## Troubleshooting

### Erro: "failed to connect to all addresses"

**Possíveis causas:**

1. **Servidor não está rodando**
   - Confirme que o servidor está ativo e escutando na porta 50051

2. **IP errado**
   - Verifique o IP correto do servidor

3. **Firewall bloqueando**
   - O servidor pode ter o firewall bloqueando a porta 50051
   - Peça para o administrador do servidor liberar a porta

4. **Redes diferentes**
   - Certifique-se de estar na mesma rede do servidor
   - Use `ipconfig` (Windows) ou `ifconfig` (Linux/Mac) para verificar
   - Os primeiros 3 números do IP devem ser iguais (ex: `192.168.1.x`)

### Erro: "No module named 'grpc'"

```bash
pip install grpcio grpcio-tools
```

### Erro: "No module named 'hello_pb2'"

Você precisa gerar os arquivos proto:
```bash
cd grpc-demo
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```

### Como descobrir o IP do servidor?

Se você tem acesso ao servidor, execute:

**No Windows:**
```bash
ipconfig
```

**No Linux/Mac:**
```bash
ifconfig
# ou
ip addr show
```

Procure por **"Endereço IPv4"** ou **"inet"** na interface de rede ativa.

---

## Checklist Rápido

- [ ] Python instalado e funcionando
- [ ] Dependências gRPC instaladas (`pip install grpcio grpcio-tools`)
- [ ] Arquivos proto gerados (comando `protoc`)
- [ ] IP do servidor conhecido
- [ ] Servidor está rodando e acessível
- [ ] Mesma rede que o servidor (para conexão remota)

---

## Resumo

Para um PC novo que só tem Python e o repositório clonado:

1. Instalar gRPC: `pip install grpcio grpcio-tools`
2. Gerar arquivos proto: `python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto`
3. Rodar cliente: `python client.py`

**Porta padrão:** 50051  
**Para testar localmente:** Use `localhost` ou `127.0.0.1`  
**Para conectar remotamente:** Use o IP do servidor na mesma rede
