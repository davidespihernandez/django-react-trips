from django.urls import reverse
from rest_framework import status

from trips.models import User
from trips.tests.views.base import BaseAPITestCase


class DeleteUserTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:user-detail", kwargs={"pk": self.user_id})

    def setUp(self):
        self.user = self.builder.regular_user(
            username="first",
            first_name="First",
            last_name="Last1",
            email="first@example.test",
        )
        self.user_id = self.user.id

    def call_api(self):
        return self.client.delete(self.get_url())

    def test_anonymous_user_cant_delete(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cant_delete(self):
        self.force_login_regular_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_manager_user_can_delete(self):
        self.force_login_manager_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user_id).first())

    def test_admin_user_can_delete(self):
        self.force_login_admin_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user_id).first())

    def test_manager_user_cant_delete_an_admin_user(self):
        self.user.role = User.ADMIN
        self.user.save()
        self.force_login_manager_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
