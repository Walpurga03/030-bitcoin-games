import bild01 from './image/btc-1.png'
import bild02 from './image/btc-2.png'
import bild03 from './image/btc-3.png'
import bild04 from './image/btc-4.png'

import React, {useState} from 'react';
import styled from 'styled-components';
import {useInterval} from "react-use";

function ShitRain() {
  const image_array = [
    <Photo src={bild01} alt="" />,
    <Photo src={bild02} alt="" />,
    <Photo src={bild03} alt="" />,
    <Photo src={bild04} alt="" />,
  ];

  
  const [emojisToRender, setEmojisToRender] = useState([{offset: 0, key: 0, emoji: ''}]);

  useInterval(() => {
    if (emojisToRender.length > 50) {
      emojisToRender.shift();
    }

     // get a random index
     const random_index = Math.floor(Math.random() * image_array.length);
     //get a image at the random_index
     const selected_image = image_array[random_index]
     //Display the Image
    
    const offset = Math.floor(Math.random() * window.innerWidth); //position
    const key = offset + Math.random() * 1000000;
    const emoji = selected_image;
   
    emojisToRender.push({offset, key, emoji});

    setEmojisToRender([...emojisToRender]);
  }, 100);

  return (
    <SuperContainer>
      {emojisToRender.map(({key, emoji, offset}) => {
        return (
          <EmojiContainer key={key} offset={offset}>
            {emoji}
          </EmojiContainer>
        );
      })}
    </SuperContainer>
  );
}

export default ShitRain;

const SuperContainer = styled.div`
  display: flex;
  align-items: center;
  width: 70%;
  height: 50%;
`;

const EmojiContainer = styled.div`
position: absolute;
top: 80px;
left: ${props => props.offset}px;

animation-name: falldown;
animation-duration: 6s;

@keyframes falldown {
  0%  { margin-top: 10rem; }
  25% { margin-left: 5rem;}
  50% { margin-left: -7rem;}
  75% { margin-left: 9rem; opacity: 0.9 }
  100%{ margin-top: 50rem; opacity: 0}
}
`;

const Photo = styled.img`
  width: 100%;
  height: 100px;
  width: 100px;
`;
