FROM trufflesuite/ganache-cli

ADD .env .env
ADD entry.sh entry.sh
ADD db db

ENTRYPOINT [ "./entry.sh" ]