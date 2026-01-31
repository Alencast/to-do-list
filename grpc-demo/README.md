# gRPC - Lista Todos da Aplicação

## 1. Gerar os arquivos Python do .proto
```bash
cd grpc-demo
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. hello.proto
```

## 2. Rodar o servidor (Terminal 1)
```bash
cd grpc-demo
python server.py
```

## 3. Rodar o cliente (Terminal 2)
```bash
cd grpc-demo
python client.py
```

O cliente vai buscar TODOS os itens da todo list cadastrados no banco de dados! 📋
