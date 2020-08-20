from rest_framework.routers import DefaultRouter

from trips.views.users import UserViewSet
from trips.views.trips import TripViewSet

app_name = "trips"

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"trips", TripViewSet, basename="trip")
urlpatterns = router.urls
