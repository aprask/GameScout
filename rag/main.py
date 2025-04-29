from app.core.embedder import convert_text_into_embedding
from app.core.parser import run
from app.data.vectors import pinecone_init

if __name__ == "__main__":
    titles = ["The Elder Scrolls V: Skyrim"]
    aggregated_games = []
    aggregated_chunks = []
    idx = 0
    for title in titles:
        game_summary = run(title).strip()
        if game_summary is None: 
            continue
        if len(game_summary) > 4096:
            game_summary = game_summary[:4096]
        aggregated_games.append({title: game_summary})
        embedded_games = convert_text_into_embedding(game_summary)
        aggregated_chunks.append({title: embedded_games})
        pinecone_init(title=title, embedding=aggregated_chunks[idx][title], chunk=aggregated_games[idx][title])
        idx += 1