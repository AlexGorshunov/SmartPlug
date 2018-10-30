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

const getSonoffData = async() => {
  try {
    const result = await requestSonoff.get('cm?cmnd=EnergyReset')
    await requestLogstash.post('/', {
      body: {
        '@timestamp': moment().utcOffset('+03:00').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        energy: result.EnergyReset,
        device_id: 'sonoff:device1',
        device_type: 'sonoffPow',
        user_id: config.user.id,
      }
    })
  } catch(error) {
    console.error(error);
  }
};
setInterval(getSonoffData, 2000);


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
        await requestLogstash.post('/', {
          body: {
            '@timestamp': moment().utcOffset('+03:00').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            powerload: powerLoad,
            device_id: id,
            device_type: 'xiaomiSmartPlug',
            user_id: config.user.id,
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