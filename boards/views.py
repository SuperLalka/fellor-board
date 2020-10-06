from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from . import models
from fellor_board import utils


def main_page(request, **kwargs):
    return render(request, 'index.html')


def boards(request):
    if request.method == "POST":
        models.Boards.objects.get_or_create(name=request.POST['board_name'])
        return JsonResponse({"success": True}, status=200)
    elif request.method == "GET":
        boards_list = utils.from_object_to_json(models.Boards.objects.all(), 'board')
        return JsonResponse({'boards': boards_list}, status=200)


def concrete_board(request, board_id):
    if request.method == "GET":
        board_columns = models.Columns.objects.filter(board_id=board_id)
        board_columns = utils.from_object_to_json(board_columns, 'column')
        board_cards = models.Cards.objects.filter(column_id__board_id=board_id)
        board_cards = utils.from_object_to_json(board_cards, 'card')
        board_bg_color = models.Boards.objects.get(id=board_id).bg_color

        return JsonResponse({
            'board_columns': board_columns,
            'board_cards': board_cards,
            'board_bg_color': board_bg_color},
            status=200)

    elif request.method == "POST":
        board = models.Boards.objects.get(id=board_id)
        board.name = request.POST['name']
        board.bg_color = request.POST['bg_color']
        board.save()
        return JsonResponse({"success": True}, status=200)

    elif request.method == "DELETE":
        models.Boards.objects.get(id=board_id).delete()
        return JsonResponse({"success": True}, status=200)


def columns(request):
    if request.method == "POST":
        models.Columns.objects.get_or_create(
            name=request.POST['column_name'],
            board_id=request.POST['board_id']
        )
        return JsonResponse({"success": True}, status=200)


def concrete_column(request, column_id):
    if request.method == "POST":
        column = models.Columns.objects.get(id=column_id)
        column.name = request.data['new_name']
        column.save()
        return JsonResponse({"success": True}, status=200)

    elif request.method == "DELETE":
        models.Columns.objects.get(id=column_id).delete()
        return JsonResponse({"success": True}, status=200)


def change_columns(request, column_id):
    if request.method == "POST":
        if request.POST['operation'] == 'copy':
            column = models.Columns.objects.get(id=column_id)
            new_column = models.Columns.objects.create(name=column.name, board_id=column.board_id)
            column_cards = models.Cards.objects.filter(column_id=column_id)

            for card in column_cards:
                models.Cards.objects.create(name=card.name, column_id=new_column.id)
            return JsonResponse({"success": True}, status=200)


def cards(request):
    if request.method == "POST":
        models.Cards.objects.get_or_create(
            name=request.POST['card_name'],
            column_id=request.POST['column_id']
        )
        return JsonResponse({"success": True}, status=200)


def concrete_card(request, card_id):
    if request.method == "POST":
        card = models.Cards.objects.get(id=card_id)
        card.name = request.data['new_name']
        card.save()
        return JsonResponse({"success": True}, status=200)

    elif request.method == "DELETE":
        models.Cards.objects.get(id=card_id).delete()
        return JsonResponse({"success": True}, status=200)


def change_card(request, card_id):
    if request.method == "POST":
        card = models.Cards.objects.get(id=card_id)
        if request.POST['operation'] == 'copy':
            models.Cards.objects.create(name=card.name, column_id=card.column_id)
            return JsonResponse({"success": True}, status=200)
        elif request.POST['operation'] == 'move':
            card.column_id = request.POST['new_column_id']
            card.save()
            return JsonResponse({"success": True}, status=200)


def comments(request, card_id):
    if request.method == "POST":
        models.Comments.objects.create(card_id=card_id, text=request.POST['comment_text'])
        return JsonResponse({"success": True}, status=200)

    elif request.method == "GET":
        comments_list = utils.from_object_to_json(models.Comments.objects.filter(card_id=card_id), 'comment')
        return JsonResponse({'comments': comments_list}, status=200)


def search_cards(request, key):
    found_cards = models.Cards.objects.filter(name__icontains=key)
    found_cards = utils.from_object_to_json(found_cards, 'card')
    return JsonResponse({'found_cards': found_cards}, status=200)
