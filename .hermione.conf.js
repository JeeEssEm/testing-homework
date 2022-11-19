module.exports = {
  baseUrl: "https://ya.ru",
  browsers: {
    chrome: {
      automationProtocol: "devtools",
      desiredCapabilities: {
        browserName: "chrome",
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      path: "hermione-html-report",
    },
  },
};
