import find from 'local-devices';

(async () => {
  const devices = await find('172.16.15.0/24');
  devices.forEach((device) => {
    console.warn(device);
  });
})();
