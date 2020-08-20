from datetime import date, timedelta

import dateutil.parser
from django.urls import reverse
from rest_framework import status

from trips.models import Trip
from trips.tests.views.base import BaseAPITestCase


class UpdateTripTestCase(BaseAPITestCase):
    today = date.today()

    def get_url(self):
        return reverse("trips:trip-detail", kwargs={"pk": self.trip_id})

    def setUp(self):
        self.regular_user = self.builder.regular_user()
        self.trip = self.builder.trip(
            destination="original destination",
            comment="original comment",
            start_date=self.today,
            end_date=self.today + timedelta(days=1),
            user=self.regular_user,
        )
        self.trip_id = self.trip.id
        self.to_change = {
            "destination": "changed destination",
            "comment": "changed comment",
            "start_date": str(self.today + timedelta(days=1)),
            "end_date": str(self.today + timedelta(days=2)),
        }

    def call_api(self):
        return self.client.put(self.get_url(), self.to_change)

    def check_result_is_correct(self, response, model_changed: Trip):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        model_changed.refresh_from_db()
        self.assertEqual(model_changed.destination, self.to_change["destination"])
        self.assertEqual(model_changed.comment, self.to_change["comment"])
        self.assertEqual(
            model_changed.start_date,
            dateutil.parser.parse(self.to_change["start_date"]).date(),
        )
        self.assertEqual(
            model_changed.end_date,
            dateutil.parser.parse(self.to_change["end_date"]).date(),
        )
        if "user" in self.to_change:
            self.assertEqual(model_changed.user.id, self.to_change["user"])

    def test_anonymous_user_cant_update(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_can_update_own_record(self):
        self.client.force_login(self.regular_user)
        response = self.call_api()
        self.check_result_is_correct(response, self.trip)

    def test_regular_user_cant_update_other_user_record(self):
        self.force_login_regular_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_manager_user_can_update_own_record(self):
        self.force_login_manager_user()
        self.trip.user = self.request_user
        self.trip.save()
        response = self.call_api()
        self.check_result_is_correct(response, self.trip)

    def test_manager_user_cant_update_other_user_record(self):
        self.force_login_manager_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_user_can_update_own_record(self):
        self.force_login_admin_user()
        self.trip.user = self.request_user
        self.trip.save()
        response = self.call_api()
        self.check_result_is_correct(response, self.trip)

    def test_admin_user_can_update_other_user_record(self):
        self.force_login_admin_user()
        response = self.call_api()
        self.check_result_is_correct(response, self.trip)

    def test_empty_destination_fails(self):
        self.force_login_admin_user()
        self.to_change["destination"] = ""
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
