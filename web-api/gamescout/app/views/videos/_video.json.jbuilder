json.extract! video, :id, :video_id, :url, :game_id, :created_at, :updated_at
json.url video_url(video, format: :json)
