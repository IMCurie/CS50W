import markdown2
import random

from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {"entries": util.list_entries()})


def entry(request, name):
    entry_md, actual_name = util.get_entry(name)
    if entry_md is None:
        return render(
            request,
            "encyclopedia/entry.html",
            {
                "entry_name": name,
                "error_message": f"The entry '{name}' does not exist",
            },
        )

    entry_html = markdown2.markdown(entry_md)
    if actual_name != name:
        return HttpResponseRedirect(reverse("encyclopedia:entry", args=[actual_name]))

    return render(
        request,
        "encyclopedia/entry.html",
        {
            "entry_name": name,
            "entry_content": entry_html,
        },
    )


def search(request):
    entry_name = request.POST["q"]

    _, actual_name = util.get_entry(entry_name)
    search_entries = util.list_entries()

    search_entries_lower = list(map(str.lower, search_entries))
    if entry_name in search_entries_lower:
        return HttpResponseRedirect(reverse("encyclopedia:entry", args=[actual_name]))
    else:
        entries = []
        for entry in search_entries:
            if entry_name.lower() in entry.lower():
                entries.append(entry)
        return render(
            request,
            "encyclopedia/search.html",
            {"entries": entries},
        )


def new(request):
    if request.method == "POST":
        title = request.POST["title"]
        content = f"#{title}\n" + request.POST["content"]
        util.save_entry(title, content)

        entry_html = markdown2.markdown(content)
        return render(
            request,
            "encyclopedia/entry.html",
            {
                "entry_name": title,
                "entry_content": entry_html,
            },
        )

    return render(request, "encyclopedia/new_entry.html")


def random_entry(request):
    random_entry = random.choice(util.list_entries())
    return HttpResponseRedirect(reverse("encyclopedia:entry", args=[random_entry]))
