import './singleCard.scss';
import coverImg from './image/cover.png';

const SingleCard = ({card, handleChoice, flipped, disabled}) => {
  const handleClick = () => {
    if(!disabled){
      handleChoice(card)
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img src={card.src} alt="card front" className="front" />
        <img 
          className='back' 
          src={coverImg}
          alt="cover"
          onClick={handleClick} />
      </div>
    </div>
  )
};

export default SingleCard;








  