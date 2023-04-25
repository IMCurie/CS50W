from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, AuctionList, Bid, Comment


class AuctionListAdmin(admin.ModelAdmin):
    list_display = ("id", "publisher", "title", "category", "start_price", "create_time", "image_url")


class BidAdmin(admin.ModelAdmin):
    list_display = ("id", "bidder", "auction_item", "bid_price")


class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "comment_user", "comment_item", "content")


admin.site.register(User, UserAdmin)
admin.site.register(AuctionList, AuctionListAdmin)
admin.site.register(Bid, BidAdmin)
admin.site.register(Comment, CommentAdmin)