from datetime import date, timedelta

from django.urls import reverse
from rest_framework import status

from trips.models import Trip
from trips.tests.views.base import BaseAPITestCase


class CreateTripTestCase(BaseAPITestCase):
    today = date.today()

    def get_url(self):
        return reverse("trips:trip-list")

    def setUp(self):
        self.trip_data = {
            "destination": "destination",
            "comment": "comment",
            "start_date": str(self.today),
            "end_date": str(self.today + timedelta(days=1)),
            "count_to_trip_start": 0,
        }

    def call_api(self, data):
        return self.client.post(self.get_url(), data)

    def check_trip_created(self, response, trip_user=None, creator=None):
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        user_id = data.pop("user")
        data.pop("user_full_name")
        trip_user = trip_user or self.request_user
        self.assertEqual(user_id, trip_user.id)
        trip_id = data.pop("id")
        self.assertDictEqual(self.trip_data, data)
        trip = Trip.objects.filter(pk=trip_id).first()
        self.assertIsNotNone(trip)
        if creator:
            self.assertEqual(trip.creator.id, creator.id)

    def test_anonymous_user_cant_create_trip(self):
        response = self.call_api(self.trip_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_can_create_trip(self):
        self.force_login_regular_user()
        response = self.call_api(self.trip_data)
        self.check_trip_created(response)

    def test_manager_user_can_create_trip(self):
        self.force_login_manager_user()
        response = self.call_api(self.trip_data)
        self.check_trip_created(response)

    def test_admin_user_can_create_trip_for_himself(self):
        self.force_login_manager_user()
        response = self.call_api(self.trip_data)
        self.check_trip_created(response)

    def test_admin_user_can_create_trip_for_another(self):
        self.force_login_admin_user()
        trip_user = self.builder.regular_user()
        self.trip_data["user"] = trip_user.pk
        response = self.call_api(self.trip_data)
        self.trip_data.pop("user")
        self.check_trip_created(
            response, trip_user=trip_user, creator=self.request_user
        )

    def test_id_is_read_only_when_creating(self):
        self.force_login_regular_user()
        passed_id = -1
        self.trip_data["id"] = passed_id
        response = self.call_api(self.trip_data)
        returned_id = response.data["id"]
        self.trip_data.pop("id")
        self.check_trip_created(response)
        self.assertNotEqual(passed_id, returned_id)

    def test_destination_is_mandatory(self):
        self.force_login_regular_user()
        self.trip_data["destination"] = ""
        response = self.call_api(self.trip_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_start_date_is_mandatory(self):
        self.force_login_regular_user()
        self.trip_data["start_date"] = ""
        response = self.call_api(self.trip_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_end_date_is_mandatory(self):
        self.force_login_regular_user()
        self.trip_data["end_date"] = ""
        response = self.call_api(self.trip_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_comment_is_not_mandatory(self):
        self.force_login_regular_user()
        self.trip_data["comment"] = ""
        response = self.call_api(self.trip_data)
        self.check_trip_created(response)

    def test_count_to_trip_start_more_days(self):
        self.force_login_regular_user()
        self.trip_data["start_date"] = str(self.today + timedelta(days=1))
        self.trip_data["end_date"] = str(self.today + timedelta(days=2))
        self.trip_data["count_to_trip_start"] = 1
        response = self.call_api(self.trip_data)
        self.check_trip_created(response)

    def test_count_to_trip_start_past_date(self):
        self.force_login_regular_user()
        self.trip_data["start_date"] = str(self.today - timedelta(days=1))
        self.trip_data["end_date"] = str(self.today + timedelta(days=1))
        self.trip_data.pop("count_to_trip_start")
        response = self.call_api(self.trip_data)
        self.trip_data["count_to_trip_start"] = None
        self.check_trip_created(response)

    def test_end_date_is_after_start_date(self):
        self.force_login_regular_user()
        self.trip_data["start_date"] = str(self.today + timedelta(days=1))
        self.trip_data["end_date"] = str(self.today)
        response = self.call_api(self.trip_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
