from datetime import date

from dateutil.relativedelta import relativedelta
from django.urls import reverse
from rest_framework import status

from trips.tests.views.base import BaseAPITestCase


class RetrieveNextMonthPlanTestCase(BaseAPITestCase):
    def get_url(self):
        return reverse("trips:user-next-month-travel-plan")

    def call_api(self):
        return self.client.get(self.get_url())

    def test_anonymous_user_cant_retrieve_next_month_plan(self):
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_pdf_file_is_returned(self):
        self.force_login_regular_user()
        response = self.call_api()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        next_month = date.today() + relativedelta(months=1)
        month_name = next_month.strftime("%B")
        year = next_month.year
        filename = f"plan_{month_name}_{year}.pdf"
        content = f"attachment: filename={filename}"
        self.assertEqual(response["Content-Disposition"], content)
        self.assertEqual(response["Content-Type"], "application/pdf")
