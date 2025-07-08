from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allow anyone to read, but only the owner can update or delete.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS = GET, HEAD, OPTIONS → allow all
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only owner can modify
        return obj.owner == request.user
