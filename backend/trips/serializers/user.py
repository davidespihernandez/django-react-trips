from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from trips.models import User


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    password = serializers.CharField(write_only=True, allow_null=False, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "role",
        ]

    def _check_role(self, validated_data):
        request_user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            request_user = request.user
        if not request_user.is_anonymous and "role" in validated_data:
            # a user can't update another user to a higher role than his/her own
            if request_user.role < validated_data["role"]:
                raise ValidationError("Wrong role")
        else:
            # anonymous request, or no role
            validated_data["role"] = User.REGULAR

    def create(self, validated_data):
        self._check_role(validated_data)
        password = validated_data.pop("password", None)
        if not password:
            raise ValidationError("Password is mandatory")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        self._check_role(validated_data)
        if "password" in validated_data:
            password = validated_data.pop("password")
            instance.set_password(password)
        return super().update(instance, validated_data)
