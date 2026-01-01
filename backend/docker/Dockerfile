FROM ruby:3.3.0
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

ENV API_APP_PATH /app

RUN mkdir $API_APP_PATH
WORKDIR $API_APP_PATH

COPY ./backend/Gemfile $API_APP_PATH/Gemfile
COPY ./backend/Gemfile.lock $API_APP_PATH/Gemfile.lock
RUN bundle install

COPY ./backend $API_APP_PATH

COPY ./docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]
