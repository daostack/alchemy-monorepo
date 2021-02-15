sudo apt-get install -y libsecret-1-dev curl
npm run lint -- --quiet
npm run test:unit -- --forceExit
npm run build