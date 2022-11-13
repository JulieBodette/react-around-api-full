import close from '../images/CloseIcon.svg';
import check from '../images/check.svg';
import redX from '../images/redX.svg';

export function InfoTooltip({ onClose, isOpen, success }) {
  return (
    <div className={`modal ${isOpen && 'modal_open'}`}>
      {/*} id="infotooltip-popup">*/}
      <div className="infotooltip__content">
        {success ? (
          <img className="infotooltip__image" src={check} />
        ) : (
          <img className="infotooltip__image" src={redX} />
        )}
        {/*src={`url(${card.link})`}*/}
        <button
          type="button"
          className="infotooltip__close-button"
          onClick={onClose}
        >
          <img src={close} alt="X" />
        </button>
        <h2 className="infotooltip__text">
          {success
            ? 'Success! You have now been registered.'
            : 'Oops, something went wrong! Please try again.'}
        </h2>
      </div>
    </div>
  );
}
