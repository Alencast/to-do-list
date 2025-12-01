from django.db import models
from django.contrib.auth.models import User

class TodoItem(models.Model):
    PRIORITY_CHOICES = [
        (1, 'Alta'),
        (2, 'Média'),
        (3, 'Baixa'),
    ]
    
    title = models.CharField(max_length=255, verbose_name='Título')
    priority = models.IntegerField(
        choices=PRIORITY_CHOICES, 
        default=2, 
        verbose_name='Prioridade'
    )
    completed = models.BooleanField(default=False, verbose_name='Concluída')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    
    class Meta:
        ordering = ['priority', '-created_at']
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'
    
    def __str__(self):
        return self.title