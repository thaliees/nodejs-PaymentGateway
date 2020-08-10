'use strict'
require('dotenv').config();
const app = require('./app');
const message = `Mode ${process.env.NODE_ENV}.
                This API is available and ready for its use.
                Documentation Available: ${process.env.HOST}/api/api-docs`;
app.get('/', (req, res) => res.send(message));
app.listen(process.env.PORT, () => { console.log(`Run in: ${process.env.HOST}`) });