# Generated by Django 4.2 on 2023-04-27 07:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("auctions", "0015_auctionlist_description"),
    ]

    operations = [
        migrations.AlterField(
            model_name="auctionlist",
            name="image_url",
            field=models.URLField(default="https://picsum.photos/1000/650"),
        ),
    ]
