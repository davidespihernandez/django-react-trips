from django.urls import reverse
from rest_framework import status

from trips.models import User
from trips.tests.views.base import BaseAPITestCase


class CreateUserTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:user-list")

    def setUp(self):
        self.user_data = {
            "username": "newuser@example.com",
            "first_name": "New",
            "last_name": "User",
            "email": "newuser@example.com",
            "password": "newuser",
            "role": 1,
        }

    def call_api(self, data):
        return self.client.post(self.get_url(), data)

    def check_user_created(self, response):
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data
        user_id = data.pop("id")
        self.assertIsNotNone(user_id)
        self.user_data.pop("password")
        self.assertDictEqual(self.user_data, data)

    def test_anonymous_user_can_register_user(self):
        response = self.call_api(self.user_data)
        self.check_user_created(response)

    def test_manager_user_can_create_user(self):
        self.force_login_manager_user()
        response = self.call_api(self.user_data)
        self.check_user_created(response)

    def test_admin_user_can_create_user(self):
        self.force_login_manager_user()
        response = self.call_api(self.user_data)
        self.check_user_created(response)

    def test_regular_user_cant_create_user(self):
        self.force_login_regular_user()
        response = self.call_api(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_duplicated_username_not_allowed(self):
        existing = self.builder.regular_user(username=self.user_data["username"])
        response = self.call_api(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_id_is_read_only_when_creating(self):
        passed_id = -1
        self.user_data["id"] = passed_id
        response = self.call_api(self.user_data)
        returned_id = response.data["id"]
        self.user_data.pop("id")
        self.check_user_created(response)
        self.assertNotEqual(passed_id, returned_id)

    def test_username_is_mandatory(self):
        self.user_data["username"] = ""
        response = self.call_api(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_is_mandatory(self):
        self.user_data["password"] = ""
        response = self.call_api(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_manager_cant_create_admin_role(self):
        self.force_login_manager_user()
        self.user_data["role"] = User.ADMIN
        response = self.call_api(self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_anonymous_can_create_only_regular_role(self):
        self.user_data["role"] = User.MANAGER
        response = self.call_api(self.user_data)
        # the role created is always 1
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["role"], User.REGULAR)

    def test_manager_can_create_manager_role(self):
        self.force_login_manager_user()
        self.user_data["role"] = User.MANAGER
        response = self.call_api(self.user_data)
        self.check_user_created(response)

    def test_admin_can_create_admin_role(self):
        self.force_login_admin_user()
        self.user_data["role"] = User.ADMIN
        response = self.call_api(self.user_data)
        self.check_user_created(response)

    def test_created_user_can_login(self):
        self.call_api(self.user_data)
        login_result = self.client.login(
            username=self.user_data["username"], password=self.user_data["password"]
        )
        self.assertTrue(login_result)
