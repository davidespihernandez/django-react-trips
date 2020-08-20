from rest_framework.test import APITestCase

from trips.tests.builder import Builder


class BaseAPITestCase(APITestCase):
    builder = Builder()

    def get_url(self):
        raise NotImplemented

    def force_login_regular_user(self):
        self.request_user = self.builder.regular_user(username="ZZZ1", first_name="ZZZ")
        self.client.force_login(self.request_user)

    def force_login_manager_user(self):
        self.request_user = self.builder.manager_user(username="ZZZ2", first_name="ZZZ")
        self.client.force_login(self.request_user)

    def force_login_admin_user(self):
        self.request_user = self.builder.admin_user(username="ZZZ3", first_name="ZZZ")
        self.client.force_login(self.request_user)
