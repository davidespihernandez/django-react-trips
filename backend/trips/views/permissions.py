from rest_framework.permissions import IsAuthenticated

from trips.models import User


class IsManager(IsAuthenticated):
    """
    Allows access only to users with manager role.
    """

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.isManager()


class IsAdmin(IsAuthenticated):
    """
    Allows access only to users with admin role.
    """

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.isAdmin()


class IsAdminOrManager(IsAuthenticated):
    """
    Allows access only to users with admin or manager role.
    """

    def has_permission(self, request, view):
        return super().has_permission(request, view) and (
            request.user.isAdmin() or request.user.isManager()
        )
