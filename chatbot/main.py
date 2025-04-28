from app.core.embedder import convert_text_into_embedding
from app.core.processor import chunk_data
from app.core.parser import run
from app.data.vectors import make_db

if __name__ == "__main__":
    games = [
        "The Elder Scrolls V: Skyrim"
    ]
    parsed_games = run(games)
    print(parsed_games)
    chunked_games = chunk_data(parsed_games)
    print(chunked_games)
    embedded_games = convert_text_into_embedding(chunked_games)
    print(embedded_games)
    make_db(embedded_games)

