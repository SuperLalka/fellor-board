from django.db import models

BOARDS_BG_COLOR = "Enter the background color of the board"


class Boards(models.Model):
    name = models.CharField(max_length=40, help_text="Enter board name")
    bg_color = models.CharField(max_length=15, help_text=BOARDS_BG_COLOR,
                                default='cadetblue', null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']
        verbose_name = 'Доска'
        verbose_name_plural = 'Доски'


class Columns(models.Model):
    name = models.CharField(max_length=40, help_text="Enter column name")
    board = models.ForeignKey('Boards', on_delete=models.CASCADE,
                              null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Колонка'
        verbose_name_plural = 'Колонки'


class Cards(models.Model):
    name = models.CharField(max_length=40, help_text="Enter card name")
    column = models.ForeignKey('Columns', on_delete=models.CASCADE,
                               null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']
        verbose_name = 'Карточка'
        verbose_name_plural = 'Карточки'


class Comments(models.Model):
    text = models.TextField(max_length=200)
    card = models.ForeignKey('Cards', on_delete=models.CASCADE,
                             null=True, blank=True)

    def __str__(self):
        return '{0}.{1}'.format(self.card, self.id)

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
