from django.conf.urls import url
from django.urls import include

from . import views


operations = [
    url(r'^boards$', views.BoardsList.as_view(), name='boards_list'),
    url(r'^boards/(?P<id>\w+)$', views.BoardsDetail.as_view(), name='boards_detail'),
    url(r'^columns$', views.ColumnsList.as_view(), name='columns_list'),
    url(r'^columns/(?P<id>\w+)$', views.ColumnsDetail.as_view(), name='columns_detail'),
    url(r'^cards$', views.CardsList.as_view(), name='cards_list'),
    url(r'^cards/(?P<id>\w+)$', views.CardsDetail.as_view(), name='cards_detail'),
    url(r'^comments$', views.CommentsList.as_view(), name='comments_list'),
    url(r'^comments/(?P<id>\w+)$', views.CommentsDetail.as_view(), name='comments_detail'),
]

app_name = 'boards'
urlpatterns = [
    url(r'^$', views.main_page, name='main-page'),
    url(r'^api/', include(operations)),
]
