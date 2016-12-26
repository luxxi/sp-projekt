Rails.application.routes.draw do
  root 'pages#landing'
  get 'about' => 'pages#about'
  devise_for :users
  resources :tasks, only: ['index', 'new', 'create', 'edit', 'update']
  mount ActionCable.server => '/cable'
end
