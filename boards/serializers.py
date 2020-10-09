from rest_framework import serializers

from .models import Boards, Cards, Columns, Comments


class BoardsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=40)
    bg_color = serializers.CharField(max_length=15, default='cadetblue', required=False)

    class Meta:
        model = Boards
        fields = '__all__'


class ColumnsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=40)
    board_id = serializers.IntegerField()

    class Meta:
        model = Columns
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        cards = Cards.objects.filter(column_id=instance.id)
        representation['cards'] = CardsSerializer(cards, many=True).data
        return representation


class CardsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=40)
    column_id = serializers.IntegerField()

    class Meta:
        model = Cards
        fields = '__all__'


class CommentsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    text = serializers.CharField(max_length=200, required=False)
    card_id = serializers.IntegerField()

    class Meta:
        model = Comments
        fields = '__all__'
