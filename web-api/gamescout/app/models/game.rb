class Game < ApplicationRecord
  has_many :genres
  has_many :platforms
  has_many :release_dates
  has_many :involved_companies
  has_many :screenshots
  has_many :videos
end
