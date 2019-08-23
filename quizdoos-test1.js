const Gpio = require('onoff').Gpio;
const led = new Gpio(22, 'out');
const button = new Gpio(25, 'in', 'rising', {debounceTimeout: 10});
 
button.watch((err, value) => {
  if (err) {
    throw err;
  }
 
  led.writeSync(led.readSync() ^ 1);
});
 
process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});