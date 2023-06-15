import React from 'react';
import { useState, useEffect } from 'react';
import SingleCard from './singleCard/singleCard';
import ShitRain from '../../components/shitRain/shitRain';
import styled from 'styled-components';
/**
 * Dieser Code definiert ein Array namens “cardImages”, 
 * das eine Liste von Bildern enthält. 
 * Jedes Bild wird durch ein Objekt dargestellt, 
 * das eine “src”-Eigenschaft enthält, die den Pfad zum Bild angibt, 
 * und eine “matched”-Eigenschaft, 
 * die angibt, ob das Bild mit einem anderen Bild im Spiel übereinstimmt. 
 * Die “matched”-Eigenschaft wird standardmäßig auf “false” gesetzt.
 */
const cardImages = [
  { "src": "/img/image-11.jpg", matched: false },
  { "src": "/img/image-12.jpg", matched: false },
  { "src": "/img/image-13.jpg", matched: false },
  { "src": "/img/image-14.jpg", matched: false },
  { "src": "/img/image-15.jpg", matched: false },
  { "src": "/img/image-16.jpg", matched: false },
  { "src": "/img/image-17.jpg", matched: false },
  { "src": "/img/image-18.jpg", matched: false }
];
const Memory = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [hits, setHits] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
 /**
  * Dieser Code definiert eine Funktion namens “shuffleCards”, 
  * die das “cardImages”-Array mischt und die Karten für das Memory-Spiel vorbereitet. 
  * Zunächst wird eine neue Array-Instanz erstellt, 
  * indem das “cardImages”-Array zweimal kopiert wird. 
  * Dann wird das neue Array zufällig sortiert und jeder Karte wird eine zufällige ID zugewiesen. 
  * Schließlich werden einige Zustände zurückgesetzt und die Karten werden auf das neu sortierte Array gesetzt.
  */
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }))
      
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setHits(0)
  };
  /**
   * Wenn “choiceOne” nicht null ist, wird “setChoiceTwo” aufgerufen und die zweite Karte ausgewählt. 
   * Andernfalls wird “setChoiceOne” aufgerufen und die erste Karte ausgewählt. 
   */
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  };
  /**
   * Dieser Code definiert eine “useEffect”-Funktion, die aufgerufen wird, wenn sich “choiceOne” oder “choiceTwo” ändern. 
   * Wenn beide Werte nicht null sind, wird die “disabled”-Variable auf “true” gesetzt und überprüft, 
   * ob die beiden ausgewählten Karten übereinstimmen. 
   * Wenn sie übereinstimmen, wird die “matched”-Eigenschaft der Karten auf “true” gesetzt und der Zustand des Spiels wird zurückgesetzt. 
   * Wenn sie nicht übereinstimmen, 
   * wird eine Verzögerung von einer Sekunde eingeführt und der Zustand des Spiels wird zurückgesetzt.
   */
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src){
              return {...card, matched: true}
            }else{
              return card
            }
          })
        })
        resetTurn()
        setHits(prevHits => prevHits + 1)
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo]);
  /**
   * Dieser Code definiert eine Funktion namens “win”, die aufgerufen wird, 
   * wenn der Spieler alle Paare im Memory-Spiel gefunden hat. 
   * Wenn “hits” gleich 8 ist, wird die “ShitRain”-Komponente gerendert. 
   * Andernfalls wird nichts gerendert.
   */
  const win = () => {
      if(hits === 8) {
        return(
          <ShitRain />
       )
      }else{
      <></>
    };
  };
   /**
    * Dieser Code definiert eine Funktion namens “resetTurn”, 
    * die aufgerufen wird, wenn der Spieler zwei Karten im Memory-Spiel ausgewählt hat. 
    * Die “choiceOne”- und “choiceTwo”-Variablen werden auf “null” gesetzt, 
    * die Anzahl der Züge wird um eins erhöht und die “disabled”-Variable wird auf “false” gesetzt.
    */
   const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  };
  //start a neues spiel
  useEffect(() => {
    shuffleCards()
  },[]);
  /**
   * Dieser Code definiert eine React-Komponente namens “App”, 
   * die ein Memory-Spiel implementiert. 
   * Die Komponente enthält eine Überschrift, 
   * einen Button zum Starten eines neuen Spiels, ein Raster von Karten, 
   * die durch die “SingleCard”-Komponente dargestellt werden, und eine Anzeige für die Anzahl der Versuche.
   */
  return (
    <MemoryContainer>
     <h1>Bitcoin Memory</h1>
      <Button onClick={shuffleCards}>Neues Spiel</Button>
      <CardGrid>
        {cards.map(card => (
          <SingleCard 
          key={card.id}
          card={card}
          handleChoice={handleChoice}
          flipped ={card === choiceOne || card === choiceTwo || card.matched}
          disabled={disabled}
          />
          ))}
      </CardGrid>
      <Turns className='turns'>
        {win()}
        <p>Versuche: {turns}</p>
      </Turns>
    </MemoryContainer>
  )
};

const MemoryContainer = styled.div`
  text-align: center;
  max-width: 860px;
  margin: 0rem auto;
  padding: 1rem;
  background-color: black;
`;

const Button = styled.button`
  background: none;
  border: 2px solid #fff;
  padding: 6px 12px;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background: #F7931A;
    color: #fff;
  }
`;

const CardGrid = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  grid-gap: 20px;
`;

const Turns = styled.div`
  color: white;
`


export default Memory;