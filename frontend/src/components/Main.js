import React, { useState, useEffect } from 'react';
import avatar from '../images/Avatar.jpg';
import edit from '../images/Edit.svg';
import plus from '../images/Plus.svg';

import { Card } from './Card.js';

import { UserContext } from '../contexts/CurrentUserContext';

export function Main({
  onEditProfileClick,
  onAddPlaceClick,
  onEditAvatarClick,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = React.useContext(UserContext);

  return (
    <main>
      <section className="profile">
        {/* profile is a grid */}
        <div className="profile__image">
          <img
            className="profile__avatar"
            src={currentUser && currentUser.avatar}
            alt="Avatar"
          />
          <button
            className="profile__icon"
            id="edit-avatar-button"
            onClick={onEditAvatarClick}
          >
            {/*either set the background image of the button or do an <img> here */}
          </button>
        </div>
        <div className="profile__info">
          {/*cannot be span (w3c error from having <p> tag) */}
          <h1 className="profile__info-name">
            {currentUser && currentUser.name}
          </h1>
          <button
            type="button"
            className="profile__info-edit-button"
            id="profile-info-edit-button"
            onClick={onEditProfileClick}
          >
            <img src={edit} alt="Edit" />
          </button>

          <p className="profile__info-title">
            {currentUser && currentUser.about}
          </p>
        </div>
        <button
          type="button"
          className="profile__add-button"
          id="profile-add-button"
          onClick={onAddPlaceClick}
        >
          <img src={plus} alt="Add" />
        </button>
      </section>
      <section className="grid">
        {/*Elements section. This is a grid of pictures*/}
        {/*array of cards via cards state variable goes here*/}
        {cards.map((item) => (
          <Card
            key={item._id}
            card={item}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}
