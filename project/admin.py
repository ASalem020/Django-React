from django.contrib import admin
from project.models import Campaign
from donation.models import Donation

admin.site.register(Campaign)
admin.site.register(Donation)
