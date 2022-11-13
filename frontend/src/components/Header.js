//its useful to import the css here
//import './header.css'
import { Link } from 'react-router-dom';

//we import the image that it needs
import header from '../images/Header.svg';

export function Header({ text, link, onClick, email }) {
  return (
    <header className="header">
      <img className="header__image" src={header} alt="Around the US" />
      {/*we acess the image via variable name {header}*/}

      <p className="header__email">{email}</p>
      <Link to={link} onClick={onClick} className="header__login-text">
        {text}
      </Link>
      {/*onClick is set to a function so that code can be called on logout. All other times it does not need to be set to a function.*/}
    </header>
  );
}
