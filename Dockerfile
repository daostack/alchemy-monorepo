FROM mhart/alpine-node:8

# install git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app
COPY . .
RUN npm install

ENV DOCKER true
EXPOSE 8545

ENTRYPOINT [ "npm", "run", "ganache", "--" ]