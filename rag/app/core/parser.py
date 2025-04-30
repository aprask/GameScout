import wikipediaapi  # type: ignore

wiki_wiki = wikipediaapi.Wikipedia(user_agent="Gamescout", language="en")


def is_game_page(title):
    page = wiki_wiki.page(title)
    if not page.exists():
        return False
    categories_list = page.categories.keys()
    for category in categories_list:
        if "game" in category.lower():
            return True
    return False


def get_page_text(title):
    page = wiki_wiki.page(title)
    if not page.exists():
        return None
    return page.summary


def run(title):
    if is_game_page(title):
        return get_page_text(title)
    else:
        return None
