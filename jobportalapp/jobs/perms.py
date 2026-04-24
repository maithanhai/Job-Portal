from rest_framework import permissions

class IsVerifiedEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
        if request.user.role!='EMPLOYER':
            return False
        if hasattr(request.user, 'employer') and not request.user.employer.is_verified:
            return False
        return True
class IsVerifiedCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            return False
        if request.user.role!='CANDIDATE':
            return False
        if hasattr(request.user,'candidate') and not request.user.candidate.is_verified:
            return False
        return True
