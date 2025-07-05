from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    Adds phone number field with Egyptian number validation
    and makes email field unique.
    """
    phone_regex = RegexValidator(
        regex=r'^01[0-9]{9}$',
        message="Please enter a valid Egyptian phone number (10 digits starting with 01)"
    )

    phone = models.CharField(
        max_length=11,
        validators=[phone_regex],
        unique=True,
        verbose_name="Phone Number"
    )

    email = models.EmailField(
        unique=True,
        verbose_name="Email Address"
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True
    )

    def __str__(self):
        return f"{self.username} - {self.email}"

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
