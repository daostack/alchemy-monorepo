npm ci
nohup npm run ganache &
npm run lint
npm run migrate -- --force
