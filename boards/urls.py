from django.conf.urls import url
from django.urls import include

from . import views


operations = [
    url(r'^boards$', views.boards, name='boards'),
    url(r'^boards/(?P<board_id>\w+)$', views.concrete_board, name='concrete_board'),
    url(r'^columns$', views.columns, name='columns'),
    url(r'^columns/(?P<column_id>\w+)$', views.concrete_column, name='concrete_column'),
    url(r'^columns/change/(?P<column_id>\w+)$', views.change_columns, name='change_columns'),
    url(r'^cards$', views.cards, name='cards'),
    url(r'^cards/(?P<card_id>\w+)$', views.concrete_card, name='concrete_card'),
    url(r'^cards/change/(?P<card_id>\w+)$', views.change_card, name='change_card'),
    url(r'^cards/comments/(?P<card_id>\w+)$', views.comments, name='comments'),
    url(r'^cards/search/(?P<key>\S+)$', views.search_cards, name='search_cards'),
]

app_name = 'boards'
urlpatterns = [
    url(r'^$', views.main_page, name='main-page'),
    url(r'^api/', include(operations)),
]
