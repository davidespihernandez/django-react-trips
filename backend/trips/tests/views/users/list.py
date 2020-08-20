from django.urls import reverse
from rest_framework import status

from trips.models import User
from trips.tests.views.base import BaseAPITestCase


class ListUserTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:user-list")

    def setUp(self):
        self.first_user = self.builder.regular_user(
            username="first",
            first_name="First",
            last_name="Last1",
            email="first@example.test",
        )
        self.second_user = self.builder.regular_user(
            username="second",
            first_name="Second",
            last_name="Last2",
            email="second@example.test",
        )
        self.third_user = self.builder.regular_user(
            username="third",
            first_name="Third",
            last_name="Last3",
            email="third@example.test",
        )

    def calculate_expected(self, *users):
        expected_list = {"next": None, "previous": None, "results": []}
        if len(users) == 0:
            users = [
                self.first_user,
                self.second_user,
                self.third_user,
                self.request_user,
            ]

        for user in users:
            expected_list["results"].append(
                {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "role": user.role,
                }
            )
        expected_list["count"] = len(users)
        return expected_list

    def call_api(self, data=None):
        return self.client.get(self.get_url(), data)

    def check_list_is_correct(self, response, expected_list):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(response.data, expected_list)

    def test_anonymous_user_cant_retrieve_list(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_manager_user_retrieves_list(self):
        self.force_login_manager_user()
        response = self.call_api()
        # user list is ordered alphabetically
        self.check_list_is_correct(response, self.calculate_expected())

    def test_admin_user_retrieves_list(self):
        self.force_login_admin_user()
        response = self.call_api()
        self.check_list_is_correct(response, self.calculate_expected())

    def test_filters_by_role(self):
        self.force_login_admin_user()
        response = self.call_api(data={"role": User.REGULAR})
        # request user (admin) is not in the results
        self.check_list_is_correct(
            response,
            self.calculate_expected(self.first_user, self.second_user, self.third_user),
        )

    def test_filters_by_first_name(self):
        self.force_login_admin_user()
        response = self.call_api(data={"first_name": self.first_user.first_name})
        self.check_list_is_correct(response, self.calculate_expected(self.first_user))

    def test_filters_by_last_name(self):
        self.force_login_admin_user()
        response = self.call_api(data={"last_name": self.third_user.last_name})
        self.check_list_is_correct(response, self.calculate_expected(self.third_user))

    def test_filters_by_email(self):
        self.force_login_admin_user()
        response = self.call_api(data={"email": self.second_user.email})
        self.check_list_is_correct(response, self.calculate_expected(self.second_user))

    def test_filters_by_search(self):
        # first_name or last_name, case insensitive
        self.force_login_admin_user()
        with self.subTest("Filters first user"):
            response = self.call_api(data={"search": "fi"})
            self.check_list_is_correct(
                response, self.calculate_expected(self.first_user)
            )

        with self.subTest("Filters all last"):
            response = self.call_api(data={"search": "last"})
            self.check_list_is_correct(
                response,
                self.calculate_expected(
                    self.first_user, self.second_user, self.third_user
                ),
            )
