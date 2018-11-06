const miio = require('miio');
const { power } = require('abstract-things/values');
const { energy } = require('abstract-things/values');
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

const main = async () => {

  try {

    const device = await miio.device({address: '192.168.3.170', token: '0bc1cbdf0556cac735574fc7102d5846'});
    const child = device.child('miio:158d00026a3bee');
    const togglePower = await child.togglePower()
    device.destroy()

  } catch (e) {
    console.error(e);
  }

};

setInterval(main, 60000);