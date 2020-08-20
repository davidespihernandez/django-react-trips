from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    REGULAR = 1
    MANAGER = 2
    ADMIN = 3

    ROLE_CHOICES = ((REGULAR, "Regular"), (MANAGER, "Manager"), (ADMIN, "Admin"))
    role = models.IntegerField(
        choices=ROLE_CHOICES, blank=False, null=False, default=REGULAR
    )

    def isAdmin(self):
        return self.role == User.ADMIN

    def isManager(self):
        return self.role == User.MANAGER

    def isRegular(self):
        return self.role == User.REGULAR

    def __str__(self):
        return " ".join([field for field in [self.first_name, self.last_name] if field])
