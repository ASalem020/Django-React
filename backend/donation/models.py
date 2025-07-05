from django.db import models
from app.models import User
from project.models import Campaign 

class Donation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} donated {self.amount} to {self.campaign.title}"
