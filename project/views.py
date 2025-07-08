from rest_framework import viewsets, permissions, serializers
from .models import Campaign
from django.contrib.auth import get_user_model
from .serializers import CampaignSerializer
from .permissions import IsOwnerOrReadOnly
User = get_user_model()
class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise serializers.ValidationError("You must be logged in")
        if not User.objects.filter(id=self.request.user.id).exists():
            raise serializers.ValidationError("User account no longer exists")
        serializer.save(owner=self.request.user)
