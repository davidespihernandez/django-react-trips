from django.urls import reverse
from rest_framework import status

from trips.models import User
from trips.tests.views.base import BaseAPITestCase


class ProfileUpdateUserTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:user-update-profile")

    def setUp(self):
        self.initial_password = "regular"
        self.regular_user = self.builder.regular_user(
            username="regular",
            first_name="regular",
            last_name="user",
            email="regular@example.test",
            password=self.initial_password,
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
        if "password" in self.to_change:
            self.assertTrue(model_changed.check_password(self.to_change["password"]))
        else:
            self.assertTrue(model_changed.check_password(self.initial_password))
        self.assertEqual(model_changed.role, self.to_change["role"])

    def test_anonymous_user_cant_update_profile(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_is_updated(self):
        self.client.force_login(self.regular_user)
        response = self.call_api()
        self.check_result_is_correct(response, self.regular_user)

    def test_duplicate_username_fails(self):
        existing = self.builder.regular_user(username="existing")
        self.to_change["username"] = "existing"
        self.client.force_login(self.regular_user)
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_username_fails(self):
        self.to_change["username"] = ""
        self.client.force_login(self.regular_user)
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cant_update_to_higher_role(self):
        self.to_change["role"] = User.ADMIN
        self.client.force_login(self.regular_user)
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_is_not_mandatory(self):
        self.to_change.pop("password")
        self.client.force_login(self.regular_user)
        response = self.call_api()
        self.check_result_is_correct(response, self.regular_user)


class ProfileRetrieveUserTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:user-profile")

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

    def test_anonymous_user_cant_retrieve_profile(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_is_retrieved(self):
        self.client.force_login(self.user)
        response = self.call_api()
        self.check_result_is_correct(response)
