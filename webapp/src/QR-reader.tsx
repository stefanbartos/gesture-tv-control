import React, { useState } from 'react';
import { QrReader } from '@blackbox-vision/react-qr-reader';
import { useNavigate } from "react-router-dom";

const QRScreen = () => {
  const navigate = useNavigate();
  const [data, setData] = useState('No result');

  const processData = (data: string): void => {

    try {
      const dataObject = JSON.parse(data);
      const { type, uuid } = dataObject;

      setData(data);

      if (type && type === 'TV') {
        if (uuid) {
          localStorage.setItem('tvID', uuid);
          alert(`TV ID ${uuid} was loaded`);
        }
      }

      navigate('/');
    } catch (e) {
      console.error(e);
      alert('Error occurred');
    }
  }

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            processData(result.getText());
          }

          if (!!error) {
            console.error(error);
          }
        }}
        videoStyle={{ width: '100%' }}
        constraints={{
          facingMode: 'environment'
        }}
      />
      <p>{data}</p>
    </>
  );
};

export default QRScreen;
