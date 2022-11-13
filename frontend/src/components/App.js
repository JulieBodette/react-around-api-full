import React, { useState, useCallback } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import close from '../images/CloseIcon.svg';

import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { Main } from './Main.js';

import { PopupWithForm } from './PopupWithForm.js';
import { ImagePopup } from './ImagePopup.js';

import apiObj from '../utils/api.js';
import ProtectedRoute from './ProtectedRoute.js';
import { signUp, signIn, checkToken } from '../utils/auth.js';

import { UserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';

import { Login } from './Login';
import { Register } from './Register';

import { InfoTooltip } from './InfoTooltip';
import { AuthorizationError } from '../utils/errors.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  /*state variable for the card the user clicked on/ is seeing the image popup of*/
  const [selectedCard, setSelectedCard] = useState(null);
  /*state variable for the cards on the page */
  const [cards, setCards] = useState([]);
  /*state variables responsible for visibility of popups*/
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState();
  const [successMessage, setSuccessMessage] = useState(false); //used to determine if InfoToolTip displays a sucess or failure message
  const [email, setEmail] = useState(''); //we get the email from the token
  const history = useHistory();

  function handleLogOutClick() {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  }

  function handleSignUpClick(info) {
    /*add calls to auth.js functions, determine if sign up was sucessful */
    //SignUp returns a resolved promise or a rejected promise (error)
    signUp(info)
      .then((res) => {
        setSuccessMessage(true);
        history.push('/signin'); //redirect to login page so the new user can log in
      })
      .catch((err) => {
        setSuccessMessage(false);
        console.log(err);
      })
      .finally(() => {
        setIsInfoTooltipOpen(true);
      });
  }

  //useCallback means it will only re-render when whatever is in [] changes
  //in this case it only re-renders when history is changed.
  const handleSignInClick = useCallback(
    (info) => {
      signIn(info)
        .then((data) => {
          // saving the token
          if (data?.token) {
            localStorage.setItem('token', data.token);
          } else {
            throw new AuthorizationError(
              'error- username and/or password was wrong'
            );
          }
        })
        .then(() => {
          setIsLoggedIn(true);
          getEmail();
          history.push('/'); // After your login action you can redirect with this command:
        })
        .catch((err) => {
          //catch does not catch 400 level errors- only 500. a 400 level error will be a resolved promise and has a message.
          //this is why we had to manually throw a new AuthorizationError
          console.log(err);
          //TODO: show a popup that says "your username or passord is wrong"
          //currently displays a generic error message
          setSuccessMessage(false); //prepare the InfoToolTip so that it has failure message
          //important that we do this RIGHT before we open the tooltip- to ensure that ANY error we catch will result in the failure popup
          setIsInfoTooltipOpen(true);
        });
    },
    [history]
  );

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setTimeout(() => {
      setSelectedCard(null);
    }, 500);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleUpdateUser(info) {
    apiObj
      .patchUserInfo(info)
      .then((userInfoResponse) => {
        //we do these 2 commands in 1 .then statement because they don't have to be done sequentially
        setCurrentUser(userInfoResponse);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  function handleUpdateAvatar(info) {
    apiObj
      .patchUserAvatar(info)
      .then((userInfoResponse) => {
        //we do these 2 commands in 1 .then statement because they don't have to be done sequentially
        setCurrentUser(userInfoResponse);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  function handleAddPlace(info) {
    apiObj
      .uploadCard(info)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    //The some() method tests whether at least one element in the array passes the test
    //in this case, if 1 of the likes is from the current user, we need to make the heart dark
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    //if !isLiked- if the card was not liked before and now the user wants to like it
    if (!isLiked) {
      apiObj.likeCard(card._id).then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        ).catch((err) => {
          console.log(err); // log the error to the console
        });
      });
    }
    //if isLiked - if the user already liked it and is now unliking it
    else {
      apiObj
        .unlikeCard(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((currentCard) =>
              currentCard._id === card._id ? newCard : currentCard
            )
          );
        })
        .catch((err) => {
          console.log(err); // log the error to the console
        });
    }
  }

  function handleCardDelete(card) {
    apiObj
      .deleteCard(card._id)
      .then(() => {
        //filter will only include cards that pass the test- in this case, it includes all cards except the deletedCard
        setCards((state) =>
          state.filter((CurrentCard) => CurrentCard._id !== card._id)
        );
      })
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  //this is called when the component is mounted. we pass it [] to make sure it only gets call once when its mounted
  //otherwise it would be called every time it updates
  React.useEffect(() => {
    apiObj
      .getUserInfo()
      .then((userInfoResponse) => {
        setCurrentUser(userInfoResponse);
      })
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }, []);

  //load the initial cards from the server
  React.useEffect(() => {
    apiObj
      .getInitialCards()
      .then((cardsResponse) => {
        setCards(cardsResponse);
      })
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }, []); //empty array tells it to only do once (when it is mounted)

  React.useEffect(() => {
    // do token check and set state variables

    //check to make sure that there is a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      //check to make sure the token is valid
      checkToken()
        .then(() => {
          setIsLoggedIn(true);
          getEmail();
          history.push('/');
        })
        .catch((err) => {
          console.log(err);
        });
    } //end if
  }, [history]);

  function getEmail() {
    checkToken()
      .then((mail) => {
        setEmail(mail);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <UserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__content">
          <Switch>
            <Route path="/signup">
              <Header text="Log in" link="/signin" />
              <Register handleSignUp={handleSignUpClick} />
            </Route>
            <Route path="/signin">
              <Header text="Sign Up" link="/signup" />
              <Login handleLogin={handleSignInClick} />
            </Route>
            <ProtectedRoute exact path="/" loggedIn={isLoggedIn}>
              <Header
                text="Log out"
                link="/signin"
                onClick={handleLogOutClick}
                email={email}
              />
              {/*note to self: make it so this actually logs the user out, in addition to switching the page they are on */}
              <Main
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleEditPlaceClick}
                onEditAvatarClick={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            </ProtectedRoute>
          </Switch>

          <Footer />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlace}
          />

          <PopupWithForm
            title="Are you sure?"
            //fix the name and isOpen later - this is the confirmation popup for delete
            name=""
            isOpen={false}
            onClose={closeAllPopups}
          />
        </div>

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          isOpen={isImagePopupOpen}
        />

        <InfoTooltip
          onClose={closeAllPopups}
          isOpen={isInfoTooltipOpen}
          success={successMessage}
        />

        {/*modal for the image popup*/}
        <div className="popup modal" id="image-popup">
          <div className="popup__content">
            <img className="popup__image" />
            <button type="button" className="modal__close-button">
              <img src={close} alt="X" />
            </button>
            <h2 className="popup__caption">insert caption here</h2>
          </div>
        </div>

        {/*modal for the delete button to ask if the user is sure*/}
        <div className="modal" id="delete-card-modal">
          <div className="modal__content">
            <button type="button" className="modal__close-button">
              <img src={close} alt="X" />
            </button>
            <h2 className="modal__title">Are you sure?</h2>
            <form name="delete" className="modal__form">
              {/*form is needed so that PopupWithForm class works with this html*/}
              <button type="submit" className="modal__submit-button">
                Yes
              </button>
            </form>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;
