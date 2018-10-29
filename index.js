const moment = require('moment');
const config = require('./config');
const requestPromise = require('request-promise');
const requestSonoff = requestPromise.defaults({
    baseUrl: config.sonoff.url,
    json: true,
});
const requestLogstash = requestPromise.defaults({
  baseUrl: config.logstash.url,
  json: true,
});

const getSonoffData = async() => {
  try {
    const result = await requestSonoff.get('cm?cmnd=EnergyReset')
    await requestLogstash.post('/', {
      body: {
        '@timestamp': moment().utcOffset('+03:00').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        energy: result.EnergyReset
      }
    })
  } catch(error) {
    console.error(error);
  }
};

var timerId = setInterval(getSonoffData, 2000);

