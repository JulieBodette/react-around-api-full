import { PopupWithForm } from './PopupWithForm.js';
import { UserContext } from '../contexts/CurrentUserContext';
import React, { useState, useEffect } from 'react';

export function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [imageName, setImageName] = useState('');
  const [imageLink, setImageLink] = useState('');

  const currentUser = React.useContext(UserContext);

  function handleImageNameChange(e) {
    setImageName(e.target.value);
  }

  function handleImageLinkChange(e) {
    setImageLink(e.target.value);
  }

  function handleSubmit(e) {
    // Prevent the browser from navigating to the form address
    e.preventDefault();
    onAddPlace({
      name: imageName,
      link: imageLink,
      likes: [], //starts with no likes
      owner: currentUser,
    });
  }

  //set the image name and link to empty strings when the popup is opened/closed
  //this will make it reset so the user does not see the old
  useEffect(() => {
    setImageName('');
    setImageLink('');
  }, [isOpen]);

  return (
    <PopupWithForm
      title="New Place"
      name="add-card"
      isOpen={isOpen}
      onClose={onClose}
    >
      {/*might need to mess with form name re:the brief and use add-card (the props.name) */}
      <form
        name="imagenameandlink"
        className="modal__form"
        onSubmit={handleSubmit}
      >
        <input
          value={imageName}
          className="modal__input-text"
          type="text"
          name="imagename"
          placeholder="Title"
          minLength="1"
          maxLength="30"
          id="imagename-input"
          onChange={handleImageNameChange}
          required
        />
        <span className="modal__error imagename-input-error">error here</span>
        {/*This modal uses placeholder , but the other one uses value*/}
        <input
          value={imageLink}
          className="modal__input-text"
          type="url"
          name="imagelink"
          placeholder="Image link"
          id="imagelink-input"
          onChange={handleImageLinkChange}
          required
        />
        {/*type=url is needed for validation- it checks to make sure user entered a url*/}
        <span className="modal__error imagelink-input-error">error here</span>
        {/*set input values to the same text as the default values on the page*/}
        <button type="submit" className="modal__submit-button">
          Create
        </button>
      </form>
    </PopupWithForm>
  );
}
