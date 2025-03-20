const webpush = require('web-push');
const cfg = require('./env');

webpush.setVapidDetails(
    `mailto:${cfg.EMAILAPP}`,
    cfg.PUBLICKEYWEBPUSH,
    cfg.PRIVATEKEYWEBPUSH
);

module.exports = webpush;