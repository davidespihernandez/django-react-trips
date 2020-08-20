from random import choice

from mixer.backend.django import mixer

from trips.models import User, Trip


class Builder:
    DESTINATIONS = [
        "ALICANTE",
        "NEW YORK",
        "BRUSSELS",
        "GHENT",
        "MADRID",
        "LONDON",
        "BARCELONA",
        "CHICAGO",
    ]

    def user(self, **kwargs):
        user = mixer.blend(User, **kwargs)
        kwargs["is_staff"] = False
        if "password" in kwargs:
            user.set_password(kwargs["password"])
            user.save()
        return user

    def regular_user(self, **kwargs):
        kwargs["role"] = User.REGULAR
        return self.user(**kwargs)

    def manager_user(self, **kwargs):
        kwargs["role"] = User.MANAGER
        return self.user(**kwargs)

    def admin_user(self, **kwargs):
        kwargs["role"] = User.ADMIN
        return self.user(**kwargs)

    def trip(self, user=None, **kwargs):
        kwargs["user"] = user or self.regular_user()
        if "comment" not in kwargs:
            kwargs["comment"] = mixer.FAKE
        if "destination" not in kwargs:
            kwargs["destination"] = choice(self.DESTINATIONS)
        return mixer.blend(Trip, **kwargs)
