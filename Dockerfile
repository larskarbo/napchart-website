FROM node:8


RUN apt-get update \
    && apt-get install -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

RUN mkdir -p /opt/node/js \
    && cd /opt/node \
    && yarn add canvas

WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
CMD node server/server
EXPOSE 3000