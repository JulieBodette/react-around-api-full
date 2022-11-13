const BASEURL = 'https://register.nomoreparties.co';
const HEADERS = { 'Content-Type': 'application/json' };

const processResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`); //same as throwing error- except the object that goes into the catch block is a string, not an error object
};

export function signUp(info) {
  const url = BASEURL + '/signup';
  return fetch(url, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(info),
  }).then(processResponse);
}

export function signIn(info) {
  const url = BASEURL + '/signin';
  return fetch(url, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(info),
  }).then(processResponse);
}

export function checkToken() {
  const url = BASEURL + '/users/me';
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(processResponse)
    .then((output) => {
      //data contains id and email
      return output.data.email;
    });
}
