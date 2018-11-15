FROM node:8

COPY . .
RUN npm install

EXPOSE 8545

ENTRYPOINT [ "npm", "run" ]
CMD [ "ganache" ]