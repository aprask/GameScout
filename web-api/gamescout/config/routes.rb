Rails.application.routes.draw do
  resources :videos
  resources :screenshots
  resources :involved_companies
  resources :release_dates
  resources :platforms
  resources :genres
  resources :games
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
