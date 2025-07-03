from django.db import models
from django.utils import timezone
from app.models import User

class Campaign(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')
    title = models.CharField(max_length=255)
    description = models.TextField()
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    

    def __str__(self):
        return self.title
