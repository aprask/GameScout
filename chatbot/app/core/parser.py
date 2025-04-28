import wikipediaapi
import time

wiki_wiki = wikipediaapi.Wikipedia(user_agent='Gamescout', language='en')

def is_game_page(title):    
    page = wiki_wiki.page(title)
    if not page.exists():
        return False
    categories_list = page.categories.keys()
    for category in categories_list:
        if "game" in category.lower():
            return True
    return False

def get_page_summary(title):
    page = wiki_wiki.page(title)
    if not page.exists():
        return None
    return page.summary

def run(titles):
    summaries = []
    for t in titles:
        if is_game_page(t):
            summary = get_page_summary(t)
            if summary:
                summaries.append(summary)
            time.sleep(0.5)
    return summaries
