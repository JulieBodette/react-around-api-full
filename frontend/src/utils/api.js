class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _processResponse = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  };

  getInitialCards() {
    const url = this._baseUrl + '/cards';
    return fetch(url, {
      headers: this._headers,
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  getUserInfo() {
    const url = this._baseUrl + '/users/me';
    return fetch(url, {
      headers: this._headers,
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  patchUserAvatar(info) {
    const url = this._baseUrl + '/users/me/avatar';
    // TO DO: check to make sure the url leads to a valid image
    //https://www.codegrepper.com/code-examples/javascript/frameworks/jquery/how+to+check+if+image+url+is+valid+javascript
    return fetch(url, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(info),
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  patchUserInfo(info) {
    const url = this._baseUrl + '/users/me';
    return fetch(url, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(info),
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  deleteCard(id) {
    const url = this._baseUrl + '/cards/' + id;
    return fetch(url, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  uploadCard(info) {
    const url = this._baseUrl + '/cards';
    return fetch(url, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(info),
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  likeCard(id) {
    const url = this._baseUrl + '/cards/likes/' + id;
    return fetch(url, {
      method: 'PUT',
      headers: this._headers,
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }

  unlikeCard(id) {
    const url = this._baseUrl + '/cards/likes/' + id;
    return fetch(url, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._processResponse)
      .catch((err) => {
        console.log(err); // log the error to the console
      });
  }
}

//create an object of the API class
const apiObj = new Api({
  baseUrl: 'https://around.nomoreparties.co/v1/group-12',
  headers: {
    authorization: '7201271b-2cce-46ab-9f28-d324b822f8cb',
    'Content-Type': 'application/json',
  },
});

export default apiObj;
