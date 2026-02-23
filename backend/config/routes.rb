Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    post "/auth/register", to: "auth#register"
    post "/auth/login", to: "auth#login"

    namespace :v1 do
      resources :posts, param: :slug do
        resources :comments, only: %i[index create destroy]
        resource :likes, only: %i[create destroy]
      end
      resources :categories, param: :slug
      resources :tags, param: :slug, only: %i[index create destroy]
      resources :users, only: %i[show update]
    end
  end
end
