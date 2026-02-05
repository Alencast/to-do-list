import grpc
import hello_pb2
import hello_pb2_grpc
import sys


def run(server_address='localhost:50051'):
    print(f'Conectando ao servidor: {server_address}')
    channel = grpc.insecure_channel(server_address)
    stub = hello_pb2_grpc.TodoServiceStub(channel)
    
    #No gRPC, toda chamada de método precisa enviar uma mensagem, 
    # mesmo que você não precise mandar dados. É uma regra do protocolo.
    response = stub.ListTodos(hello_pb2.Empty()) 
    
    print(f'\n Total de Todos: {response.count}\n')
    
    if response.count == 0:
        print('Nenhum todo cadastrado!')
    else:
        for todo in response.todos:
            status = 'ok' if todo.completed else 'x'
            priority_map = {1: 'Alta', 2: 'Média', 3: 'Baixa'}
            priority = priority_map.get(todo.priority, 'N/A')
            
            print(f'{status} [{todo.id}] {todo.title}')
            print(f'   Prioridade: {priority}')
            print()


if __name__ == '__main__':
    # Verifica se foi passado um endereço como argumento
    if len(sys.argv) > 1:
        server_address = sys.argv[1]
    else:
        print('\nEscolha o endereço do servidor:')
        print('1 - localhost:50051 (padrão)')
        print('2 - Inserir IP customizado')
        choice = input('\nOpção (1 ou 2): ').strip()
        
        if choice == '2':
            ip = input('Digite o IP do servidor: ').strip()
            port = input('Digite a porta (padrão 50051): ').strip() or '50051'
            server_address = f'{ip}:{port}'
        else:
            server_address = 'localhost:50051'
    
    try:
        run(server_address)
    except grpc.RpcError as e:
        print(f'\n❌ Erro ao conectar ao servidor: {e.details()}')
        print(f'Verifique se o servidor está rodando em {server_address}')
    except Exception as e:
        print(f'\n❌ Erro: {str(e)}')
