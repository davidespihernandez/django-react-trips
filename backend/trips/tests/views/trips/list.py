from datetime import date, timedelta

from django.urls import reverse
from rest_framework import status

from trips.tests.views.base import BaseAPITestCase


class ListTripTestCase(BaseAPITestCase):
    today = date.today()

    def get_url(self):
        return reverse("trips:trip-list")

    def setUp(self):
        self.regular_user = self.builder.regular_user()
        self.manager_user = self.builder.manager_user()
        self.admin_user = self.builder.admin_user()
        self.regular_trip_1 = self.builder.trip(
            destination="one",
            user=self.regular_user,
            start_date=self.today,
            end_date=self.today + timedelta(days=1),
        )
        self.regular_trip_2 = self.builder.trip(
            destination="two",
            user=self.regular_user,
            start_date=self.today + timedelta(days=2),
            end_date=self.today + timedelta(days=3),
        )
        self.manager_trip_1 = self.builder.trip(
            destination="one",
            user=self.manager_user,
            start_date=self.today,
            end_date=self.today + timedelta(days=1),
        )
        self.manager_trip_2 = self.builder.trip(
            destination="two",
            user=self.manager_user,
            start_date=self.today + timedelta(days=2),
            end_date=self.today + timedelta(days=3),
        )
        self.admin_trip_1 = self.builder.trip(
            destination="one",
            user=self.admin_user,
            start_date=self.today,
            end_date=self.today + timedelta(days=1),
        )
        self.admin_trip_2 = self.builder.trip(
            destination="two",
            user=self.admin_user,
            start_date=self.today + timedelta(days=2),
            end_date=self.today + timedelta(days=3),
        )

    def calculate_expected(self, *trips):
        expected_list = {"next": None, "previous": None, "results": []}
        for trip in trips:
            expected_list["results"].append(
                {
                    "id": trip.id,
                    "destination": trip.destination,
                    "comment": trip.comment,
                    "start_date": str(trip.start_date),
                    "end_date": str(trip.end_date),
                    "count_to_trip_start": trip.count_to_trip_start(),
                    "user": trip.user.id,
                    "user_full_name": str(trip.user),
                }
            )
        expected_list["count"] = len(trips)
        return expected_list

    def call_api(self, data=None):
        return self.client.get(self.get_url(), data)

    def check_list_is_correct(self, response, expected_list):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response.data, expected_list)

    def test_anonymous_user_cant_retrieve_list(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_retrieves_own_trips(self):
        self.client.force_login(self.regular_user)
        response = self.call_api()
        # trip list is ordered by start_date, user and pk
        self.check_list_is_correct(
            response, self.calculate_expected(self.regular_trip_1, self.regular_trip_2)
        )

    def test_regular_user_filters_own_trips(self):
        self.client.force_login(self.regular_user)
        response = self.call_api(data={"destination": "one"})
        # trip list is ordered by start_date, user and pk
        self.check_list_is_correct(
            response, self.calculate_expected(self.regular_trip_1)
        )

    def test_manager_user_retrieves_own_trips(self):
        self.client.force_login(self.manager_user)
        response = self.call_api()
        # trip list is ordered by start_date, user and pk
        self.check_list_is_correct(
            response, self.calculate_expected(self.manager_trip_1, self.manager_trip_2)
        )

    def test_manager_user_filters_own_trips(self):
        self.client.force_login(self.manager_user)
        response = self.call_api(data={"destination": "one"})
        # trip list is ordered by start_date, user and pk
        self.check_list_is_correct(
            response, self.calculate_expected(self.manager_trip_1)
        )

    def test_admin_user_retrieves_all_trips(self):
        self.client.force_login(self.admin_user)
        response = self.call_api()
        # trip list is ordered by start_date, user and pk
        self.check_list_is_correct(
            response,
            self.calculate_expected(
                self.regular_trip_1,
                self.manager_trip_1,
                self.admin_trip_1,
                self.regular_trip_2,
                self.manager_trip_2,
                self.admin_trip_2,
            ),
        )

    def test_admin_user_filters_all_trips_by_destination(self):
        self.client.force_login(self.admin_user)
        response = self.call_api(data={"destination": "one"})
        # trip list is ordered by start_date, user and pk
        self.check_list_is_correct(
            response,
            self.calculate_expected(
                self.regular_trip_1, self.manager_trip_1, self.admin_trip_1
            ),
        )

    def test_admin_user_filters_all_trips_by_user(self):
        self.client.force_login(self.admin_user)
        response = self.call_api(data={"user": self.regular_user.pk})
        # trip list is ordered by start_date, user and pk
        self.check_list_is_correct(
            response, self.calculate_expected(self.regular_trip_1, self.regular_trip_2)
        )
