import grpc
from concurrent import futures
import sys
import os
import django

# Configurar Django
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import TodoItem
import hello_pb2
import hello_pb2_grpc


class TodoServiceServicer(hello_pb2_grpc.TodoServiceServicer):
    def ListTodos(self, request, context):
        todos = TodoItem.objects.all()
        response = hello_pb2.TodoList()
        
        for todo in todos:
            todo_item = response.todos.add()
            todo_item.id = todo.id
            todo_item.title = todo.title
            todo_item.priority = todo.priority
            todo_item.completed = todo.completed
        
        response.count = len(todos)
        return response


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    hello_pb2_grpc.add_TodoServiceServicer_to_server(TodoServiceServicer(), server)
    server.add_insecure_port('0.0.0.0:50051')
    print(' Servidor gRPC rodando na porta 50051...')
    print(' Listando todos do banco de dados Django')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
