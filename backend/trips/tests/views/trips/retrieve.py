from datetime import date, timedelta

from django.urls import reverse
from rest_framework import status

from trips.tests.views.base import BaseAPITestCase


class RetrieveTripTestCase(BaseAPITestCase):
    today = date.today()

    def get_url(self):
        return reverse("trips:trip-detail", kwargs={"pk": self.trip_id})

    def build_trip(self, user=None):
        self.user = user or self.request_user
        self.trip = self.builder.trip(
            destination="destination",
            comment="comment",
            start_date=self.today,
            end_date=self.today + timedelta(days=1),
            user=self.user,
        )
        self.trip_id = self.trip.id
        self.expected = {
            "id": self.trip.id,
            "destination": self.trip.destination,
            "comment": self.trip.comment,
            "start_date": str(self.trip.start_date),
            "end_date": str(self.trip.end_date),
            "count_to_trip_start": 0,
            "user": self.user.id,
            "user_full_name": str(self.user),
        }

    def call_api(self):
        return self.client.get(self.get_url())

    def check_result_is_correct(self, response):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response.data, self.expected)

    def test_anonymous_user_cant_retrieve_detail(self):
        other_user = self.builder.regular_user()
        self.build_trip(other_user)
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cant_retrieve_other_user_trip(self):
        self.force_login_regular_user()
        other_user = self.builder.regular_user()
        self.build_trip(other_user)
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_regular_user_retrieves_own_trip(self):
        self.force_login_regular_user()
        self.build_trip()
        response = self.call_api()
        self.check_result_is_correct(response)

    def test_manager_user_cant_retrieve_other_user_trip(self):
        self.force_login_manager_user()
        other_user = self.builder.regular_user()
        self.build_trip(other_user)
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_manager_user_retrieves_own_trip(self):
        self.force_login_manager_user()
        self.build_trip()
        response = self.call_api()
        self.check_result_is_correct(response)

    def test_admin_user_can_retrieve_other_user_trip(self):
        self.force_login_admin_user()
        other_user = self.builder.regular_user()
        self.build_trip(other_user)
        response = self.call_api()
        self.check_result_is_correct(response)

    def test_admin_user_retrieves_own_trip(self):
        self.force_login_admin_user()
        self.build_trip()
        response = self.call_api()
        self.check_result_is_correct(response)
