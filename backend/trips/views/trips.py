from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from trips.models import User, Trip
from trips.serializers.trip import TripSerializer


class TripFilterSet(filters.FilterSet):
    destination = filters.CharFilter(field_name="destination", lookup_expr="icontains")
    comment = filters.CharFilter(field_name="comment", lookup_expr="icontains")
    start_date_gte = filters.DateFilter(field_name="start_date", lookup_expr="gte")
    start_date_lt = filters.DateFilter(field_name="start_date", lookup_expr="lt")
    end_date_gte = filters.DateFilter(field_name="end_date", lookup_expr="gte")
    end_date_lt = filters.DateFilter(field_name="end_date", lookup_expr="lt")
    user = filters.ModelChoiceFilter(queryset=User.objects.all())

    class Meta:
        model = Trip
        fields = [
            "destination",
            "comment",
            "start_date_gte",
            "start_date_lt",
            "end_date_gte",
            "end_date_lt",
            "user",
        ]


class TripViewSet(viewsets.ModelViewSet):
    """
    Viewset for viewing and editing trips.
    """

    serializer_class = TripSerializer
    queryset = Trip.objects.select_related("user").order_by(
        "start_date", "user__pk", "id"
    )
    filterset_class = TripFilterSet
    permission_classes = [IsAuthenticated]

    def _filter_own_records(self, request):
        user = request.user
        if not user.isAdmin():
            self.queryset = self.get_queryset().filter(user=user)

    def list(self, request, *args, **kwargs):
        self._filter_own_records(request)
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self._filter_own_records(request)
        return super().retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self._filter_own_records(request)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self._filter_own_records(request)
        return super().update(request, *args, **kwargs)
