import { PopupWithForm } from './PopupWithForm.js';
import React, { useEffect } from 'react';
export function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const inputRef = React.useRef();
  function handleSubmit(e) {
    // Prevent the browser from navigating to the form address
    e.preventDefault();
    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  //set the image link to empty string when the popup is opened/closed
  //this will make it reset so the user does not see the old one
  useEffect(() => {
    inputRef.current.value = '';
  }, [isOpen]);

  return (
    <PopupWithForm
      title="Update Profile Picture"
      name="edit-avatar"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form name="avatarimage" className="modal__form" onSubmit={handleSubmit}>
        {/*This modal uses placeholder , but the other one
  uses value*/}
        <input
          ref={inputRef}
          className="modal__input-text"
          type="url"
          name="avatar"
          placeholder="Image link"
          id="avatar-link-input"
          required
        />
        {/*type=url is needed for validation- it checks to make sure user
            entered a url*/}
        <span className="modal__error avatar-link-input-error">error here</span>
        {/*set input values to the same text as the default values on the
            page*/}
        <button type="submit" className="modal__submit-button">
          Save
        </button>
      </form>
    </PopupWithForm>
  );
}
