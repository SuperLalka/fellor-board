# Generated by Django 3.1.2 on 2020-10-06 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0005_auto_20201006_1343'),
    ]

    operations = [
        migrations.AlterField(
            model_name='boards',
            name='bg_color',
            field=models.CharField(blank=True, default='cadetblue', help_text='Enter the background color of the board', max_length=15, null=True),
        ),
    ]
