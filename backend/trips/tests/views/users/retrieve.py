from django.urls import reverse
from rest_framework import status

from trips.tests.views.base import BaseAPITestCase


class RetrieveUserTestCase(BaseAPITestCase):
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
        self.expected = {
            "id": self.user.id,
            "username": self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "email": self.user.email,
            "role": self.user.role,
        }

    def call_api(self):
        return self.client.get(self.get_url())

    def check_result_is_correct(self, response):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response.data, self.expected)

    def test_anonymous_user_cant_retrieve_detail(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cant_retrieve_detail(self):
        self.force_login_regular_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_manager_user_retrieves_detail(self):
        self.force_login_manager_user()
        response = self.call_api()
        self.check_result_is_correct(response)

    def test_admin_user_retrieves_list(self):
        self.force_login_admin_user()
        response = self.call_api()
        self.check_result_is_correct(response)
