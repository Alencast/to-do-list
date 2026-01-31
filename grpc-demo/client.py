import grpc
import hello_pb2
import hello_pb2_grpc


def run():
    channel = grpc.insecure_channel('localhost:50051')
    stub = hello_pb2_grpc.TodoServiceStub(channel)
    
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
    run()
