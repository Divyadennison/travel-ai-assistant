from django.db import models

class Lead(models.Model):
    name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    destination = models.CharField(max_length=100)
    budget = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.destination


class Itinerary(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)
    days = models.IntegerField()
    plan = models.TextField()

    def __str__(self):
        return f"{self.lead.destination} - {self.days} days"