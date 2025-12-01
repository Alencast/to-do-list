from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TodoItem
from .serializers import TodoItemSerializer


class TodoItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar TodoItems.
    Fornece operações CRUD completas: list, create, retrieve, update, partial_update, destroy
    """
    queryset = TodoItem.objects.all()
    serializer_class = TodoItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['completed', 'priority']
    search_fields = ['title']
    ordering_fields = ['created_at', 'priority']
    
    def list(self, request, *args, **kwargs):
        """
        GET /api/todos/
        Lista todas as tarefas com suporte a filtros, busca e ordenação
        """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """
        POST /api/todos/
        Cria uma nova tarefa
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, *args, **kwargs):
        """
        GET /api/todos/{id}/
        Retorna detalhes de uma tarefa específica
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """
        PUT /api/todos/{id}/
        Atualiza completamente uma tarefa
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """
        PATCH /api/todos/{id}/
        Atualiza parcialmente uma tarefa
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """
        DELETE /api/todos/{id}/
        Remove uma tarefa
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        """
        PATCH /api/todos/{id}/toggle/
        Alterna o status de completado da tarefa
        """
        todo = self.get_object()
        todo.completed = not todo.completed
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)
    
    @action(detail=False, methods=['delete'])
    def clear_completed(self, request):
        """
        DELETE /api/todos/clear_completed/
        Remove todas as tarefas completadas
        """
        deleted_count = TodoItem.objects.filter(completed=True).delete()[0]
        return Response(
            {'message': f'{deleted_count} tarefa(s) completada(s) removida(s)'},
            status=status.HTTP_200_OK
        )
    @action(detail=False, methods=['get'])
    def teste(self, request):
        """
        GET /api/todos/teste/
        Endpoint de teste para verificar se a ViewSet está funcionando
        """
        return Response({'message': 'Endpoint de teste funcionando!'}, status=status.HTTP_200_OK)

