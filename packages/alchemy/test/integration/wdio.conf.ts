const drivers = {
  // https://chromedriver.chromium.org/
  // check for more recent versions of chrome driver here:
  // https://chromedriver.storage.googleapis.com/index.html
  chrome: {
    version: "90.0.4430.24",
    arch: process.arch,
  },
};

const config: WebdriverIO.Config = {
  specs: ["./test/integration/*.e2e.ts"],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["--no-sandbox", "--disable-dev-shm-usage", "window-size=1920,1080", "--remote-debugging-port=9222"],
      },
    },
  ],
  logLevel: "warn",
  bail: 0,
  baseUrl: "http://127.0.0.1:3000",
  waitforTimeout: 60000,
  connectionRetryTimeout: 30000,
  connectionRetryCount: 3,
  services: [
    ["selenium-standalone", {
      logPath: "logs",
      installArgs: {drivers},
      args: {drivers},
    }],
  ],

  framework: "mocha",
  reporters: ["dot", "spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 300000, // 5 mins
  },

  before: function () {
    (global as any).inAlchemyTests = true;
    const chai = require("chai");
    (global as any).expect = chai.expect;
    chai.Should();
  },
};

export { config };
