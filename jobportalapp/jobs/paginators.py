from rest_framework import pagination

class DefaultPagination(pagination.PageNumberPagination):
    page_size = 8