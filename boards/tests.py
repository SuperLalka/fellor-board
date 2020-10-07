from django.test import Client, TestCase

from .models import Boards, Cards, Columns, Comments


class BoardsApiTestCase(TestCase):

    def setUp(self):
        self.client = Client()

    def test_get_boards_empty_list(self):
        response = self.client.get('/api/boards')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"boards": []})

    def test_get_boards_list(self):
        board = Boards.objects.create(name='test')
        response = self.client.get('/api/boards')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"boards": [{"id": board.id, "name": "test", "bg_color": "cadetblue"}]})

    def test_create_board(self):
        response = self.client.post('/api/boards', {'board_name': 'test'})
        self.assertEqual(response.status_code, 201)


class BoardsWithIDApiTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.test_board = Boards.objects.create(id=1, name='test')

    def test_get_board(self):
        response = self.client.get(f'/api/boards/{self.test_board.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"board_columns": [], "board_cards": [], "board_bg_color": "cadetblue"})

    def test_get_board_with_column(self):
        self.test_board_column = Columns.objects.create(id=10, name='test_column', board_id=1)
        response = self.client.get(f'/api/boards/{self.test_board.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"board_columns": [{"id": 10, "name": "test_column"}], "board_cards": [],
                                           "board_bg_color": "cadetblue"})

    def test_post_board_with_data(self):
        response = self.client.post(f'/api/boards/{self.test_board.id}', {'name': 'lalka'})
        self.assertEqual(response.status_code, 200)
        self.test_board.refresh_from_db()
        self.assertEqual(self.test_board.name, 'lalka')

    def test_delete_board(self):
        response = self.client.delete(f'/api/boards/{self.test_board.id}')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Boards.objects.filter(id=self.test_board.id).exists())


class ColumnsApiTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.test_board = Boards.objects.create(name='test_board')
        self.test_column = Columns.objects.create(name='test_column', board_id=self.test_board.id)

    def test_create_column(self):
        response = self.client.post('/api/columns', {'name': 'test_column', 'board_id': self.test_board.id, 'id': 'false'})
        self.assertEqual(response.status_code, 201)

    def test_update_column(self):
        response = self.client.post(f'/api/columns/{self.test_column.id}', {'name': 'new_name'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Columns.objects.get(id=self.test_column.id).name, 'new_name')

    def test_delete_column(self):
        response = self.client.delete(f'/api/columns/{self.test_column.id}')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Columns.objects.filter(id=self.test_column.id).exists())


class CardsApiTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.board = Boards.objects.create(name='test_board')
        self.column = Columns.objects.create(name='test_column', board=self.board)
        self.test_card = Cards.objects.create(name='test_card', column=self.column)

    def test_create_card(self):
        response = self.client.post('/api/cards',
                                    {'name': 'new_card', 'column_id': self.column.id, 'operation': 'add'})
        self.assertEqual(response.status_code, 201)

    def test_update_card(self):
        response = self.client.post(f'/api/cards/{self.test_card.id}', {'name': 'new_name'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Cards.objects.get(id=self.test_card.id).name, 'new_name')

    def test_delete_card(self):
        response = self.client.delete(f'/api/cards/{self.test_card.id}')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Cards.objects.filter(id=self.test_card.id).exists())


class CardsCommentsAPITestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.board = Boards.objects.create(name='test_board')
        self.column = Columns.objects.create(name='test_column', board=self.board)
        self.test_card = Cards.objects.create(name='test_card', column=self.column)

    def test_create_comment(self):
        response = self.client.post(f'/api/cards/comments/{self.test_card.id}', {'text': 'comment_text'})
        self.assertEqual(response.status_code, 201)

    def test_get_comments_list(self):
        test_comment = Comments.objects.create(text='comment text', card_id=self.test_card.id)
        response = self.client.get(f'/api/cards/comments/{self.test_card.id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'comments': [{'id': test_comment.id, 'text': 'comment text'}]})


class CardsSearchAPITestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.board = Boards.objects.create(name='test_board')
        self.column_1 = Columns.objects.create(name='test_column', board=self.board)
        self.column_2 = Columns.objects.create(name='test_column_2', board=self.board)
        self.test_card_1 = Cards.objects.create(name='doggie 123', column=self.column_1)
        self.test_card_2 = Cards.objects.create(name='tired of', column=self.column_1)
        self.test_card_3 = Cards.objects.create(name='making 123', column=self.column_2)
        self.test_card_4 = Cards.objects.create(name='fiasco', column=self.column_2)
        self.key = '123'

    def test_get_found_cards(self):
        response = self.client.get(f'/api/cards/search/{self.key}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['found_cards']), 2)
