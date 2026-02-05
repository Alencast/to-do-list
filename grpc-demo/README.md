# gRPC - Lista Todos da Aplicação

## 1. Gerar os arquivos Python do .proto
```bash
cd grpc-demo
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```

## 2. Rodar LOCALMENTE (mesma máquina)

### Servidor (Terminal 1)
```bash
cd grpc-demo
python server.py
```

### Cliente (Terminal 2)

**Opção 1: Modo interativo (recomendado)**
```bash
cd grpc-demo
python client.py
```
O cliente vai perguntar se você quer conectar em localhost ou inserir um IP customizado.

**Opção 2: Passar o endereço direto**
```bash
# Conectar em localhost
python client.py localhost:50051

# Conectar em outro servidor
python client.py 192.168.1.100:50051
```

O cliente vai buscar TODOS os itens da todo list cadastrados no banco de dados! 📋

---

## 3. Rodar em MÁQUINAS DIFERENTES (servidor e cliente separados)

### 🖥️ Na máquina do SERVIDOR:

#### Passo 1: Descobrir seu IP local
No Windows, execute no terminal:
```bash
ipconfig
```
Procure por **"Endereço IPv4"** na seção da sua rede ativa (Wi-Fi ou Ethernet).
Exemplo: `192.168.1.100`

#### Passo 2: Liberar a porta no Firewall do Windows
1. Abra o **Firewall do Windows** (pesquise no menu Iniciar)
2. Clique em **"Configurações avançadas"**
3. Selecione **"Regras de Entrada"** > **"Nova Regra"**
4. Escolha **"Porta"** > **"TCP"** > Digite **50051**
5. Marque **"Permitir a conexão"**
6. Dê um nome como "gRPC Server"

#### Passo 3: Rodar o servidor
```bash
cd grpc-demo
python server.py
```
✅ Servidor rodando e aceitando conexões externas na porta 50051

---

### 💻 Na máquina do CLIENTE (outra pessoa):

#### Rodar o cliente

**Opção 1: Modo interativo**
```bash
cd grpc-demo
python client.py
```
Depois escolha a opção 2 e insira o IP do servidor.

**Opção 2: Passar o IP direto**
```bash
cd grpc-demo
python client.py 192.168.1.100:50051
```
(Substitua `192.168.1.100` pelo IP real do servidor)

---

## ⚠️ Requisitos para conexão entre máquinas diferentes:

✅ **Mesma rede:** Ambas as máquinas devem estar na mesma rede local (mesma Wi-Fi ou rede cabeada)

✅ **Firewall liberado:** A porta 50051 deve estar liberada no firewall da máquina do servidor

✅ **IP correto:** O cliente deve usar o IP local do servidor (não use `localhost` ou `127.0.0.1`)

---

## 🔧 Troubleshooting

### Erro: "failed to connect to all addresses"
- Verifique se o servidor está rodando
- Confirme se está usando o IP correto
- Verifique se a porta 50051 está liberada no firewall

### Erro: "Connection refused"
- Confirme que ambas as máquinas estão na mesma rede
- Tente desabilitar temporariamente o firewall para testar

### Como descobrir se estou na mesma rede?
- Os primeiros 3 números do IP devem ser iguais (ex: `192.168.1.x`)
