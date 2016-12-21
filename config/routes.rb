Rails.application.routes.draw do
  root 'pages#landing'

  get 'about' => 'pages#about'
end
