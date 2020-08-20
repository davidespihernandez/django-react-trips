from django.urls import reverse
from rest_framework import status

from trips.models import Trip
from trips.tests.views.base import BaseAPITestCase


class DeleteTripTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:trip-detail", kwargs={"pk": self.trip_id})

    def setUp(self):
        self.trip_user = self.builder.regular_user()
        self.trip = self.builder.trip(user=self.trip_user)
        self.trip_id = self.trip.id

    def call_api(self):
        return self.client.delete(self.get_url())

    def test_anonymous_user_cant_delete(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cant_delete_other_user_trip(self):
        self.force_login_regular_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_manager_user_cant_delete_other_user_trip(self):
        self.force_login_manager_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_user_can_delete_other_user_trip(self):
        self.force_login_admin_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Trip.objects.filter(pk=self.trip_id).first())

    def test_regular_user_can_delete_own_trip(self):
        self.force_login_regular_user()
        self.trip = self.builder.trip(user=self.request_user)
        self.trip_id = self.trip.id
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Trip.objects.filter(pk=self.trip_id).first())

    def test_manager_user_can_delete_own_trip(self):
        self.force_login_manager_user()
        self.trip = self.builder.trip(user=self.request_user)
        self.trip_id = self.trip.id
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Trip.objects.filter(pk=self.trip_id).first())

    def test_admin_user_can_delete_own_trip(self):
        self.force_login_admin_user()
        self.trip = self.builder.trip(user=self.request_user)
        self.trip_id = self.trip.id
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Trip.objects.filter(pk=self.trip_id).first())
