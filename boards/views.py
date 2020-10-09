from django.shortcuts import render
from rest_framework import filters, generics

from .models import Boards, Cards, Columns, Comments
from .serializers import BoardsSerializer, CardsSerializer, ColumnsSerializer, CommentsSerializer


def main_page(request, **kwargs):
    return render(request, 'index.html')


class BoardsList(generics.ListCreateAPIView):
    queryset = Boards.objects.all()
    serializer_class = BoardsSerializer
    authentication_classes, permission_classes = [], []


class BoardsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Boards.objects.all()
    serializer_class = BoardsSerializer
    lookup_field = 'id'
    authentication_classes, permission_classes = [], []


class ColumnsList(generics.ListCreateAPIView):
    queryset = Columns.objects.all()
    serializer_class = ColumnsSerializer
    authentication_classes, permission_classes = [], []
    filterset_fields = ['board_id']


class ColumnsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Columns.objects.all()
    serializer_class = ColumnsSerializer
    lookup_field = 'id'
    authentication_classes, permission_classes = [], []


class CardsList(generics.ListCreateAPIView):
    queryset = Cards.objects.all()
    serializer_class = CardsSerializer
    authentication_classes, permission_classes = [], []
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class CardsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cards.objects.all()
    serializer_class = CardsSerializer
    lookup_field = 'id'
    authentication_classes, permission_classes = [], []


class CommentsList(generics.ListCreateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    authentication_classes, permission_classes = [], []
    filterset_fields = ['card_id']


class CommentsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    lookup_field = 'id'
    authentication_classes, permission_classes = [], []
