from datetime import date, timedelta

from dateutil.relativedelta import relativedelta
from django.test import TestCase

from trips.models import Trip
from trips.tests.builder import Builder


class TripModelManagerTestCase(TestCase):
    builder = Builder()
    today = date.today()

    def test_for_next_month(self):
        next_month = self.today + relativedelta(months=1, day=1)
        user = self.builder.user()
        other_user = self.builder.user()
        no_trips_user = self.builder.user()
        # trip for current month
        self.builder.trip(user=user, start_date=self.today)
        # trip for other user
        self.builder.trip(user=other_user, start_date=next_month)
        # 3 trips for next month
        trips = [
            self.builder.trip(user=user, start_date=next_month + timedelta(days=i))
            for i in range(3)
        ]
        # a trip for 2 months ahead
        self.builder.trip(
            user=user, start_date=next_month + relativedelta(months=1, day=1)
        )

        with self.subTest("no_trip_user has no next month trips"):
            self.assertEqual(
                len(Trip.objects.for_user(no_trips_user).for_next_month()), 0
            )
        with self.subTest("other_user has a single trip"):
            self.assertEqual(len(Trip.objects.for_user(other_user).for_next_month()), 1)
        with self.subTest("user has 3 trips"):
            self.assertEqual(len(Trip.objects.for_user(user).for_next_month()), 3)
