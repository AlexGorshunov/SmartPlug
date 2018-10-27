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


// const miio = require('miio');
//
// const main = async () => {
//
//     try {
//
//         const device = await miio.device({address: '10.0.0.106', token: '307685c1524a96d40cb8c10ebc327928'});
//         console.log('Connected to', device)
//         await device.togglePower();
//         await device.destroy();
//
//     } catch (e) {
//         console.error(e);
//     }
//
//
// };
//
// main();


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

