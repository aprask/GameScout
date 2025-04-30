import time
from app.core.embedder import convert_text_into_embedding
from app.core.parser import run
from app.core.data.vectors import pinecone_init
from app.core.chunk import chunk_text
from app.util.game import get_game_titles


def make_db():
    titles = get_game_titles()
    idx = 0
    for title in titles:
        aggregated_games = []
        aggregated_chunks = []
        game_summary = run(title)
        if game_summary is None:
            continue
        if len(game_summary) > 4096:
            chunks = chunk_text(game_summary.split(","))
            for chunk in chunks:
                aggregated_games.append({title: chunk})
                embedded_games = convert_text_into_embedding(chunk)
                aggregated_chunks.append({title: embedded_games})
                pinecone_init(
                    title=title,
                    embedding=aggregated_chunks[idx][title],
                    chunk=aggregated_games[idx][title],
                    reset=False,
                )
                print(idx)
                idx += 1
        else:
            aggregated_games.append({title: game_summary})
            embedded_games = convert_text_into_embedding(game_summary)
            aggregated_chunks.append({title: embedded_games})
            pinecone_init(
                title=title,
                embedding=aggregated_chunks[idx][title],
                chunk=aggregated_games[idx][title],
                reset=False,
            )
        time.sleep(5)  # to prevent 429
