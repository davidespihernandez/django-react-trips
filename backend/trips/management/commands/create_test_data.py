import logging
from datetime import datetime, date, timedelta

from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand

from trips.models import User
from trips.tests.builder import Builder

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Clears the database and creates repeatable test data"
    builder = Builder()

    def create_users_by_role(self):
        self.builder.regular_user(
            username="regular@example.com",
            first_name="Regular",
            last_name="User",
            email="regular@example.com",
            password="regular1",
        )
        self.builder.manager_user(
            username="manager@example.com",
            first_name="Manager",
            last_name="User",
            email="manager@example.com",
            password="manager1",
        )
        self.builder.admin_user(
            username="admin@example.com",
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password="admin1",
        )
        self.builder.admin_user(
            username="super@example.com",
            first_name="Super",
            last_name="User",
            email="super@example.com",
            password="super1",
            is_staff=True,
        )

    def create_users_for_pagination(self):
        for i in range(11):
            self.builder.regular_user(
                username=f"pagination{i}@example.com",
                first_name="Pagination",
                last_name=f"User {i}",
                email=f"pagination{i}@example.com",
                password=f"pagination{i}1",
            )

    def create_trips(self):
        regular_user_some_trips = self.builder.regular_user(
            username="regular_trips@example.com",
            first_name="Regular Trips",
            last_name="User",
            email="regular_trips@example.com",
            password="regular_trips1",
        )
        manager_user_some_trips = self.builder.regular_user(
            username="manager_trips@example.com",
            first_name="Manager Trips",
            last_name="User",
            email="manager_trips@example.com",
            password="manager_trips1",
        )
        # 2 trips last month, 2 this month, 2 next month
        for user in [regular_user_some_trips, manager_user_some_trips]:
            today = date.today()
            first_day_last_month = today - relativedelta(months=1, day=1)
            first_day_current_month = today + relativedelta(day=1)
            first_day_next_month = today + relativedelta(months=1, day=1)
            self.builder.trip(
                user=user,
                start_date=first_day_last_month,
                end_date=first_day_last_month + timedelta(days=1),
            )
            self.builder.trip(
                user=user,
                start_date=first_day_last_month + timedelta(days=5),
                end_date=first_day_last_month + timedelta(days=6),
            )
            self.builder.trip(
                user=user,
                start_date=first_day_current_month,
                end_date=first_day_current_month + timedelta(days=1),
            )
            self.builder.trip(
                user=user,
                start_date=first_day_current_month + timedelta(days=5),
                end_date=first_day_current_month + timedelta(days=6),
            )
            self.builder.trip(
                user=user,
                start_date=first_day_next_month,
                end_date=first_day_next_month + timedelta(days=1),
            )
            self.builder.trip(
                user=user,
                start_date=first_day_next_month + timedelta(days=5),
                end_date=first_day_next_month + timedelta(days=6),
            )
        # create a user with a lot of trips next month, for the PDF report
        manager_user_some_trips = self.builder.regular_user(
            username="regular_many_trips@example.com",
            first_name="Regular Many Trips",
            last_name="User",
            email="regular_many_trips@example.com",
            password="regular_many_trips1",
        )
        for i in range(0, 30, 2):
            self.builder.trip(
                user=manager_user_some_trips,
                start_date=first_day_next_month + timedelta(days=i),
                end_date=first_day_next_month + timedelta(days=i + 1),
            )

    def handle(self, *args, **options):
        logger.info(f"start creating test data")
        logger.info(f"deleting users")
        User.objects.all().delete()  # this deletes also the trips
        logger.info(f"deleted users")
        logger.info(f"creating users")
        self.create_users_by_role()
        self.create_users_for_pagination()
        logger.info(f"creating trips")
        self.create_trips()
        logger.info(f"created test data")
