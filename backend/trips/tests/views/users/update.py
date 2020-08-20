from django.urls import reverse
from rest_framework import status

from trips.models import User
from trips.tests.views.base import BaseAPITestCase


class UpdateUserTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:user-detail", kwargs={"pk": self.user_id})

    def setUp(self):
        self.regular_user = self.builder.regular_user(
            username="regular",
            first_name="regular",
            last_name="user",
            email="regular@example.test",
        )
        self.manager_user = self.builder.manager_user(
            username="manager",
            first_name="manager",
            last_name="user",
            email="manager@example.test",
        )
        self.admin_user = self.builder.admin_user(
            username="admin",
            first_name="admin",
            last_name="user",
            email="admin@example.test",
        )
        self.user_id = self.regular_user.id
        self.to_change = {
            "username": "new",
            "first_name": "new",
            "last_name": "new",
            "email": "new@example.test",
            "password": "new",
            "role": User.REGULAR,
        }

    def call_api(self):
        return self.client.put(self.get_url(), self.to_change)

    def check_result_is_correct(self, response, model_changed: User):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        model_changed.refresh_from_db()
        self.assertEqual(model_changed.username, self.to_change["username"])
        self.assertEqual(model_changed.first_name, self.to_change["first_name"])
        self.assertEqual(model_changed.last_name, self.to_change["last_name"])
        self.assertEqual(model_changed.email, self.to_change["email"])
        self.assertTrue(model_changed.check_password(self.to_change["password"]))
        self.assertEqual(model_changed.role, self.to_change["role"])

    def test_anonymous_user_cant_update(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_manager_user_can_update(self):
        self.force_login_manager_user()
        response = self.call_api()
        self.check_result_is_correct(response, self.regular_user)

    def test_admin_user_can_update(self):
        self.force_login_admin_user()
        response = self.call_api()
        self.check_result_is_correct(response, self.regular_user)

    def test_regular_user_cant_update(self):
        self.force_login_regular_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_duplicate_username_fails(self):
        self.to_change["username"] = "admin"
        self.force_login_admin_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_username_fails(self):
        self.to_change["username"] = ""
        self.force_login_admin_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_manager_cant_update_role_to_admin(self):
        self.to_change["role"] = User.ADMIN
        self.force_login_manager_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
