# Generated by Django 4.2 on 2023-04-26 07:51

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("auctions", "0013_alter_auctionlist_description"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="auctionlist",
            name="description",
        ),
    ]
