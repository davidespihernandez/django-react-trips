from rest_framework import serializers

from trips.models import Trip, User


class TripSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    count_to_trip_start = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Trip
        fields = [
            "id",
            "destination",
            "start_date",
            "end_date",
            "comment",
            "count_to_trip_start",
            "user",
            "user_full_name",
        ]

    def _get_request_user(self):
        request_user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            request_user = request.user
        return request_user

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self._get_request_user()
        if user and user.isAdmin():
            self.fields["user"].read_only = False
            self.fields["user"].queryset = User.objects.all()
            self.fields["user"].allow_null = False

    def get_count_to_trip_start(self, obj):
        return obj.count_to_trip_start()

    def get_user_full_name(self, obj):
        return str(obj.user)

    def create(self, validated_data):
        request_user = self._get_request_user()
        if not request_user.isAdmin():
            validated_data["user"] = request_user
        else:
            validated_data["creator"] = request_user
        trip = Trip.objects.create(**validated_data)
        return trip

    def validate(self, data):
        """
        Check that start is before finish.
        """
        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError("end date must occur after start date")
        return data
