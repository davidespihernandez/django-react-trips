from datetime import datetime, date

from dateutil.relativedelta import relativedelta
from django.db import models

from trips.models import User


class TripQS(models.QuerySet):
    def for_user(self, user):
        return self.filter(user=user)

    def for_next_month(self):
        next_month_first_day = date.today() + relativedelta(months=1, day=1)
        two_months_ahead = next_month_first_day + relativedelta(months=1, day=1)
        return self.filter(
            start_date__gte=next_month_first_day, start_date__lt=two_months_ahead
        )


class Trip(models.Model):
    destination = models.TextField(null=False, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)
    comment = models.TextField(null=True, blank=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="my_trips")
    creator = models.ForeignKey(
        to=User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="created_trips",
    )

    objects = TripQS.as_manager()

    def count_to_trip_start(self):
        today = datetime.now().date()
        if self.start_date >= today:
            delta = self.start_date - today
            return delta.days
        return None  # not necessary, but i prefer it for clarity
