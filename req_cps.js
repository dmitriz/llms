const { promiseF2cps } = require('cpsfy');
const axios = require('axios');
exports.axios_cps = promiseF2cps(axios);