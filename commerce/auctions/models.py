from datetime import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    pass


class AuctionList(models.Model):
    title = models.CharField(max_length=20)
    category = models.CharField(max_length=10, blank=True)
    image_url = models.URLField(default="https://picsum.photos/1000/650")
    create_time = models.DateTimeField(default=timezone.now)
    start_price = models.FloatField(default=0)
    description =models.TextField(default="")
    publisher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publish")

    def __str__(self):
        return f"{self.id}: {self.publisher} has released {self.title}"
    

class Bid(models.Model):
    bid_price = models.FloatField(default=0)
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bid")
    auction_item = models.ForeignKey(AuctionList, on_delete=models.CASCADE, related_name="auction")

    def __str__(self):
        return f"{self.id}: {self.bidder} bid {self.auction_item} for {self.bid_price}"
    

class Comment(models.Model):
    content = models.TextField()
    comment_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    comment_item = models.ForeignKey(AuctionList, on_delete=models.CASCADE, related_name="item")

    def __str__(self):
        return f"{self.id}: {self.comment_user} for {self.comment_item}"
    