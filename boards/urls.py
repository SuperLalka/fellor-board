from django.conf.urls import url
from django.urls import include

from . import views


app_name = 'boards'
urlpatterns = [
    url(r'^$', views.main_page, name='main-page'),
]
