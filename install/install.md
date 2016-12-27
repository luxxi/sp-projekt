## Zahteve za namestitev apliakcije

Potrebujemo `ruby` in gem `rails` (`gem install rails`).

Ko sta nameščena, v rootu projekta poženemo `bundle`, da namestimo vse odvisnosti.

Ko so odvisnosti namescene, lahko nadaljujemo z vzpostavitvijo DB.

## Namestitev in zagon DB

- namestimo [postgresql](https://www.postgresql.org/) ([Navodila](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-14-04))

- zagotovimo, da je proces postgresql zagnan

- uporabimo ukaz `rake db:setup` da vzpostavimo bazo

- na koncu se `rake db:migrate`, da zgeneriramo potrebne tabele v DB

## Namestitev spletne aplikacije

Po tem, ko smo namestili in vzpostavili DB lahko pozenemo aplikacijo, to storimo z ukazom rails s.

### Heroku

Pretočimo projekt iz `https://github.com/luxxi/sp-projekt`

Se prepričamo, da v `Gemfile` obstaja `gem 'pg'`

Pred objavo aplikacije moramo imeti nameščene vse odvisnosti, to lahko preverimo s `bundle`.

Potrebno je imeti nameščen [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

Zaženemo `heroku login`

Ustvarimo novo heroku aplikacijo `heroku create`

Objavimo aplikacijo `git push heroku master`

Aplikacija uporablja ActionCable, ki potrebuje za medpolnjenje potrebuje Redis. Vključimo ga s  `heroku addons:add redistogo`

Url redis strežnika pridobimo s `heroku config | grep REDISTOGO_URL` in ga skopiramo v `config/cable.yml` v sekcijo `production`.

Poženemo `heroku run rake db:migrate` za ustvarjanje tabel v podatkovni bazi.

### Linux
Za zagon v produkcijskem okolju je potrebno prej nastaviti unicorn in nginx.

##### Unicorn setup (linux only)

Note: The unicorn_sp is set up for user ubuntu and app at $HOME/repos/sp. Make sure to change this accordingly.

- `cp unicorn/unicorn_sp /etc/init.d/unicorn_sp`
- `sudo chmod 755 /etc/init.d/unicorn_sp`
- `sudo update-rc.d unicorn_sp defaults`
- `sudo service unicorn_sp start`

##### nginx setup

- install nginx
- edit sites-available file and add

```
upstream sp_app {
    # Path to Unicorn SOCK file, as defined previously, make sure to change path
    server unix:[SP_APP_PATH]/shared/sockets/unicorn.sock fail_timeout=0;
}

# app server at port 9449 (make sure to fix it in config if changing)
server {
    listen 9449 ssl;

    include conf.d/ssl.conf;
    client_max_body_size 4G;
    server_name _;
    keepalive_timeout 5;
    root /home/ubuntu/repos/sp/public;
    try_files $uri/index.html $uri.html $uri @app;

    location ~ ^/assets/ {
        root /home/ubuntu/repos/sp/public;
        gzip_static on; # to serve pre-gzipped version
        expires max;
        add_header  Cache-Control public;
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET';
    }

    location @app {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Host $http_host;
      proxy_redirect off;
      proxy_pass http://app_server;
    }
}

# ...

server {
    # ...

    location /sp {
        proxy_pass https://127.0.0.1:9449;
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Protocol $scheme;
    }

    # ...
}```
