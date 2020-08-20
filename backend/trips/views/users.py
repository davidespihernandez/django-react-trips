from datetime import date
from io import BytesIO

from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.http import HttpResponse
from django.template.loader import get_template
from django_filters import rest_framework as filters
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from xhtml2pdf import pisa

from trips.models import User, Trip
from trips.serializers.user import UserSerializer
from trips.views.permissions import IsAdminOrManager


class UserFilterSet(filters.FilterSet):
    first_name = filters.CharFilter(field_name="first_name", lookup_expr="icontains")
    last_name = filters.CharFilter(field_name="last_name", lookup_expr="icontains")
    email = filters.CharFilter(field_name="email", lookup_expr="icontains")
    role = filters.CharFilter(field_name="role", lookup_expr="iexact")
    search = filters.CharFilter(method="filter_search")

    def filter_search(self, query, name, search):
        return query.filter(
            Q(first_name__icontains=search) | Q(last_name__icontains=search)
        )

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "role", "search"]


class UserViewSet(viewsets.ModelViewSet):
    """
    Viewset for viewing and editing users.
    """

    serializer_class = UserSerializer
    queryset = User.objects.order_by("first_name", "last_name", "id")
    filterset_class = UserFilterSet
    permission_classes_by_action = {
        "create": [AllowAny],
        "list": [IsAdminOrManager],
        "retrieve": [IsAdminOrManager],
        "update": [IsAdminOrManager],
        "destroy": [IsAdminOrManager],
    }

    def get_permissions(self):
        try:
            # return permission_classes depending on `action`
            return [
                permission()
                for permission in self.permission_classes_by_action[self.action]
            ]
        except KeyError:
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]

    def create(self, request, *args, **kwargs):
        # only anonymous request or admin or manager
        # regular users can't create other users
        if not request.user.is_anonymous and request.user.isRegular():
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        to_delete = self.get_object()
        if request.user.pk == to_delete.pk:
            # a user can't delete him/herself
            return Response(status=status.HTTP_403_FORBIDDEN)
        if request.user.role < to_delete.role:
            # a manager can't delete an admin
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        to_update = self.get_object()
        if request.user.role < to_update.role:
            # a manager can't update an admin
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    @action(
        detail=False,
        permission_classes=[IsAuthenticated],
        methods=["get"],
        url_path="profile",
    )
    def profile(self, request):
        serializer = self.serializer_class(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        permission_classes=[IsAuthenticated],
        methods=["put"],
        url_path="profile/update",
    )
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(instance=user, data=request.data)
        serializer.is_valid(raise_exception=True)
        if "role" in serializer.validated_data:
            if request.user.role < serializer.validated_data["role"]:
                # a user can't increment his/her role level
                raise ValidationError("Wrong role")

        serializer.update(user, serializer.validated_data)
        user.refresh_from_db()
        return Response(
            data=self.serializer_class(user).data, status=status.HTTP_200_OK
        )

    def render_to_pdf(self, template_src, context_dict={}):
        template = get_template(template_src)
        html = template.render(context_dict)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
        if not pdf.err:
            return HttpResponse(result.getvalue(), content_type="application/pdf")
        return None

    @action(
        detail=False,
        permission_classes=[IsAuthenticated],
        methods=["get"],
        url_path="plan",
    )
    def next_month_travel_plan(self, request):
        next_month_date = date.today() + relativedelta(months=1)
        month_name = next_month_date.strftime("%B")
        year = next_month_date.year
        user = request.user
        trips = list(Trip.objects.for_user(user).for_next_month())
        context = {
            "user": user,
            "month_name": month_name,
            "year": year,
            "total_trips": len(trips),
            "trips": trips,
        }
        response = self.render_to_pdf("trips/pdf/next_month_plan.html", context)
        if response:
            filename = f"plan_{month_name}_{year}.pdf"
            content = f"attachment: filename={filename}"
            response["Content-Disposition"] = content
            return response
        return Response(status=status.HTTP_400_BAD_REQUEST)
