# Generated by Django 5.0.4 on 2024-04-08 11:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_room_message'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Message',
        ),
        migrations.DeleteModel(
            name='Room',
        ),
    ]
