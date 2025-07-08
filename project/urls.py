from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet

router = DefaultRouter()
router.register(r'projects', CampaignViewSet, basename='projects')

urlpatterns = [
    path('', include(router.urls)),
]
