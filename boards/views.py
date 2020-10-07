from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from .models import Boards, Cards, Columns, Comments
from fellor_board.utils import from_object_to_json


def main_page(request, **kwargs):
    return render(request, 'index.html')


def boards(request):
    if request.method == "POST":
        Boards.objects.get_or_create(name=request.POST['board_name'])
        return HttpResponse(status=201)

    elif request.method == "GET":
        boards_list = from_object_to_json(Boards.objects.all(), 'board')
        return JsonResponse({'boards': boards_list}, status=200)


def concrete_board(request, board_id):
    if request.method == "GET":
        board_columns = Columns.objects.filter(board_id=board_id)
        board_columns = from_object_to_json(board_columns, 'column')
        board_cards = Cards.objects.filter(column_id__board_id=board_id)
        board_cards = from_object_to_json(board_cards, 'card')
        board_bg_color = Boards.objects.get(id=board_id).bg_color

        return JsonResponse({
            'board_columns': board_columns,
            'board_cards': board_cards,
            'board_bg_color': board_bg_color
        }, status=200)

    elif request.method == "POST":
        board = Boards.objects.get(id=board_id)

        if request.POST.get('name', False):
            board.name = request.POST['name']

        if request.POST.get('bg_color', False):
            board.bg_color = request.POST['bg_color']

        board.save()
        return HttpResponse(status=200)

    elif request.method == "DELETE":
        Boards.objects.get(id=board_id).delete()
        return HttpResponse(status=204)


def columns(request):
    if request.method == "POST":
        new_column = Columns.objects.create(
            name=request.POST['name'],
            board_id=request.POST['board_id']
        )

        if request.POST.get('id') != 'false':
            column_cards = Cards.objects.filter(column_id=request.POST['id'])

            for card in column_cards:
                Cards.objects.create(name=card.name, column_id=new_column.id)

        return HttpResponse(status=201)


def concrete_column(request, column_id):
    if request.method == "POST":
        column = Columns.objects.get(id=column_id)

        if request.POST.get('name'):
            column.name = request.POST['name']

        column.save()
        return HttpResponse(status=200)

    elif request.method == "DELETE":
        Columns.objects.get(id=column_id).delete()
        return HttpResponse(status=204)


def cards(request):
    if request.method == "POST":
        Cards.objects.create(
            name=request.POST['name'],
            column_id=request.POST['column_id']
        )
        return HttpResponse(status=201)


def concrete_card(request, card_id):
    if request.method == "POST":
        card = Cards.objects.get(id=card_id)

        if request.POST.get('name'):
            card.name = request.POST['name']

        if request.POST.get('column_id'):
            card.column_id = request.POST['column_id']

        card.save()
        return HttpResponse(status=200)

    elif request.method == "DELETE":
        Cards.objects.get(id=card_id).delete()
        return HttpResponse(status=204)


def comments(request, card_id):
    if request.method == "POST":
        Comments.objects.create(card_id=card_id, text=request.POST['text'])
        return HttpResponse(status=201)

    elif request.method == "GET":
        comments_list = from_object_to_json(Comments.objects.filter(card_id=card_id), 'comment')
        return JsonResponse({'comments': comments_list}, status=200)


def search_cards(request, key):
    found_cards = Cards.objects.filter(name__icontains=key)
    found_cards = from_object_to_json(found_cards, 'card')
    return JsonResponse({'found_cards': found_cards}, status=200)
