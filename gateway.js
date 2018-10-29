const miio = require('miio');

const main = async () => {

  try {

    const device = await miio.device({address: '192.168.2.170', token: '0bc1cbdf0556cac735574fc7102d5846'});
    console.log('Connected to', device)
    const children = device.children();
    for (const child of children) {
      if(child.matches('type:power-plug') && child.matches('cap:power-consumed')) {
        console.log('Power is', await child.power(), child);
        const powerConsumed = await child.powerConsumed();
        console.log('Power consumed:', powerConsumed);
        child.on('powerConsumedChanged', v => console.log('Changed to:', v));
      }
    }

  } catch (e) {
    console.error(e);
  }


};

main()