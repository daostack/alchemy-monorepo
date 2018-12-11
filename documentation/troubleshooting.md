# Troubleshooting your development environment

## Is graphql up and running?

visit `http://127.0.0.1:8000/by-name/daostack`

This should give you a graphiql interface.

If it says "not found", you may need to run `npm run setup-env`

## Check if graphql websocket is responding

```sh
curl --include \
     --no-buffer \
     --header "Connection: Upgrade" \
     --header "Upgrade: websocket" \
     --header "Host: 127.0.0.1:8001" \
     --header "Origin: http://127.0.0.1:8001/by-name/daostack" \
     --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     --header "Sec-WebSocket-Version: 13" \
     http://127.0.0.1:8001/by-name/daostack
```
Your resonse should look like:
```

```
