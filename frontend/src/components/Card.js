import trash from '../images/Trash.svg';
import heartDisabled from '../images/Heart_disabled.svg';
import React from 'react';
import { UserContext } from '../contexts/CurrentUserContext';

export function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  //we must send it the card that we clicked on so it knows what image to display

  const currentUser = React.useContext(UserContext);
  // Checking if the current user is the owner of the current card
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((user) => user._id === currentUser._id);
  function handleClick() {
    onCardClick(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }
  function handleDeleteClick() {
    onCardDelete(card);
  }
  return (
    <div id="card-template">
      <div className="element">
        {/*only display the delete button if card is owned by current user*/}
        {isOwn ? (
          <button
            type="button"
            className="element__trash"
            onClick={handleDeleteClick}
          >
            <img src={trash} alt="trash" className="element__trash-image" />
          </button>
        ) : (
          <></>
        )}
        <div
          className="element__image"
          style={{ backgroundImage: `url(${card.link})` }}
          //style must be wrapped in curly braces because JSX
          //use .src here if image tag, I am using style and background image because it is button
          //also the weird url(${this._cardLink});` is becasue background image, for src you can just use card.link
          alt={card.name}
          onClick={handleClick}
        ></div>
        <div className="element__rectangle">
          <h2 className="element__text">{card.name}</h2>

          {/*div contains like button and number of likes*/}
          <button
            type="button"
            className="element__like"
            onClick={handleLikeClick}
          >
            <img
              src={heartDisabled}
              alt="like"
              className={`element__like-image ${
                isLiked ? 'element__like_active' : ''
              }`}
            />
            {/*add the element__like_active class if it is liked by the current user. ps u gotta put the entire thing in {} bc its JSX code*/}
            <p className="element__like-text">{card.likes.length}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
