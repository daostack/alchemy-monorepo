FROM mhart/alpine-node:8

WORKDIR /app
COPY . .
RUN npm install

ENV DOCKER true
EXPOSE 8545

ENTRYPOINT [ "npm", "run", "ganache", "--" ]