# Generated by Django 3.1.2 on 2020-10-07 19:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0007_auto_20201007_1008'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='columns',
            options={'ordering': ['id'], 'verbose_name': 'Колонка', 'verbose_name_plural': 'Колонки'},
        ),
    ]
