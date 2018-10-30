const miio = require('miio');
const { power } = require('abstract-things/values');
const { energy } = require('abstract-things/values');
const moment = require('moment');
const config = require('./config');
const requestPromise = require('request-promise');
const requestLogstash = requestPromise.defaults({
  baseUrl: config.logstash.url,
  json: true,
});

const main = async () => {

  try {

    const device = await miio.device({address: '192.168.2.170', token: '0bc1cbdf0556cac735574fc7102d5846'});
    // console.log('Connected to', device)
    const children = device.children();
    for (const child of children) {
      if (child.matches('type:power-plug') && child.matches('cap:power-load')) {
        let id = child.id;
        const powerLoad = await child.powerLoad();
        // console.log('Plug Id is:', id);
        // console.log('Power load:', powerLoad.watts);
        // const powerConsumed = await child.powerConsumed();
        // console.log('Power consumed:', powerConsumed);
        await requestLogstash.post('/', {
          body: {
            '@timestamp': moment().utcOffset('+03:00').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            id: id,
            powerload: powerLoad,
            deviceType: 'xiaomiSmartPlug',
          }
        })
      }
    }
    device.destroy()



  } catch (e) {
    console.error(e);
  }

};

setInterval(main, 2000);