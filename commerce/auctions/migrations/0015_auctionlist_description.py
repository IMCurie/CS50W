# Generated by Django 4.2 on 2023-04-26 07:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("auctions", "0014_remove_auctionlist_description"),
    ]

    operations = [
        migrations.AddField(
            model_name="auctionlist",
            name="description",
            field=models.TextField(default=""),
        ),
    ]
