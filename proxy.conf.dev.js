const PROXY_CONFIG = {
  '/api/local': {
    target: 'http://localhost:5002/api',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  },
  '/api': {
    target: 'https://dev.stx.interticket.com/',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
};

module.exports = PROXY_CONFIG;
