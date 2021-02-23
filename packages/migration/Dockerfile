FROM mhart/alpine-node:10.13.0

# install git, python, make
RUN apk update \
    && apk upgrade \
    && apk add --no-cache bash git openssh python make g++

WORKDIR /app
COPY . .
RUN npm install

ENV DOCKER true
EXPOSE 8545

ENTRYPOINT [ "npm", "run", "ganache", "--" ]