from django.shortcuts import render

from . import models


def main_page(request, **kwargs):
    return render(request, 'index.html')


def add_new_board(request, board_name):
    models.Boards.objects.get_or_create(name=board_name)
