json.extract! game, :id, :igdb_id, :name, :summary, :storyline, :rating, :popularity, :created_at, :updated_at
json.url game_url(game, format: :json)
