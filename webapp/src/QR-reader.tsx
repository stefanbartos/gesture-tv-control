import React, { useState } from 'react';
import { QrReader } from '@blackbox-vision/react-qr-reader';

const QRScreen = () => {
  const [data, setData] = useState('No result');

  var constraints = {
    facingMode: 'environment'
  };

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          setData(JSON.parse(result))

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
        constraints={constraints}
      />
      <p>{data}</p>
    </>
  );
};

export default QRScreen;
