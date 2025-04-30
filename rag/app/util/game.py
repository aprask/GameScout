import requests
import os
from dotenv import load_dotenv  # type: ignore

load_dotenv()

API_MANAGEMENT_KEY = os.environ.get("API_MANAGEMENT_KEY")
APP_ENV = os.environ.get("APP_ENV")


def get_game_titles():
    collected_games = []
    headers = {"Authorization": f"{API_MANAGEMENT_KEY}"}
    url = "http://server:4000/api/v1/game"
    if APP_ENV == "production":
        url = "https://gamescout.xyz/api/v1/game"
    response = requests.get(url=url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        games = data.get("games", {})
        for game in games:
            collected_games.append(game.get("game_name"))
    else:
        print(f"Failed with status code {response.status_code}")
        print(response.text)
    return collected_games
