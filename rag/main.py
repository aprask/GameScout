from app.core.embedder import convert_text_into_embedding
from app.core.parser import run
from app.data.vectors import pinecone_init
import requests
import os
from dotenv import load_dotenv  # type: ignore
load_dotenv()

API_TOKEN = os.environ.get("API_MANAGEMENT_KEY")
APP_ENV = os.environ.get("APP_ENV")

def get_game_titles():
    collected_games = []
    if APP_ENV != 'production':
        headers = {
            'Authorization': f'{API_TOKEN}'
        }
        response = requests.get("http://localhost:4000/api/v1/game", headers=headers)
        if response.status_code == 200:
            data = response.json()
            games = data.get('games', {})
            for game in games:
                collected_games.append(game.get('game_name'))
        else:
            print(f'Failed with status code {response.status_code}')
            print(response.text)
    return collected_games


if __name__ == "__main__":
    titles = get_game_titles()
    print(titles)
    aggregated_games = []
    aggregated_chunks = []
    idx = 0
    for title in titles:
        game_summary = run(title)
        if game_summary is None:
            continue
        if len(game_summary) > 4096:
            game_summary = game_summary[:4096]
        aggregated_games.append({title: game_summary})
        embedded_games = convert_text_into_embedding(game_summary)
        aggregated_chunks.append({title: embedded_games})
        print(aggregated_games)
        pinecone_init(
            title=title,
            embedding=aggregated_chunks[idx][title],
            chunk=aggregated_games[idx][title],
            reset=False
        )
        idx += 1
