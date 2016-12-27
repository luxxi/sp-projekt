Rails.application.routes.draw do
  root 'pages#landing'
  get 'about' => 'pages#about'
  devise_for :users
  resources :tasks, only: ['index', 'new', 'create', 'edit', 'update']
  get 'tasks/tags' => 'tasks#tags'
  mount ActionCable.server => '/cable'
end
