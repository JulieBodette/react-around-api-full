//middleware for authorization.
// verify the token from the headers.
//If everything's fine with the token, the middleware should
//add the token payload to the user object and call next()
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  //if there is not a token
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Authorization required' });
  }

  // getting the token
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Authorization Required' });
  }

  req.user = payload; // assigning the payload(token) to the request object
  next(); // sending the request to the next middleware
};

module.exports = {
  auth,
};
