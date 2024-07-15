import { useContext, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
// import serf from './img/serf.png';
import './Question.css';

function ContextAwareToggle({ children, eventKey }) {
  const { activeEventKey } = useContext(AccordionContext);
  const [rotated, setRotated] = useState(false);

  const decoratedOnClick = useAccordionButton(eventKey, () => {
    setRotated(prevState => !prevState);
  });

  const handleClick = () => {
    decoratedOnClick(); // Викликаємо функцію для зміни стану акордеону
  };

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <div className={`accordion-button ${isCurrentEventKey ? 'active' : ''}`}>
      <Card onClick={handleClick} className={isCurrentEventKey ? 'active' : ''}>
        {' '}
        {/* Додаємо onClick для відкриття/закриття акордеону */}
        <Card.Header>
          {children}
          <button
            type="button"
            className={`accordion-icon ${rotated ? 'rotate' : ''}`}
            onClick={decoratedOnClick}
          >
            <span className="plus">+</span>
          </button>
        </Card.Header>
      </Card>
    </div>
  );
}

function Question() {
  const handleClick = () => {
    window.open('https://t.me/anatolyi_st', '_blank');
  };

  return (
    <div className="accordion-wrapper">
      <Accordion defaultActiveKey="none">
        <ContextAwareToggle eventKey="0">
          <span>Як оформити замовлення?</span>
        </ContextAwareToggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            Виберіть бажаний смак, кількість та залиште заявку на сайті. Скоро з
            вами зв'яжеться менеджер для уточнення деталей замовлення. Якщо нам
            не вдасться зв'язатися з вами по телефону, напишемо вам в Telegram
            або Viber.
            <br /> <br />
            Також ви можете самостійно{' '}
            <span onClick={handleClick} className="ourMan">
              написати нашому менеджеру в Telegram
            </span>
          </Card.Body>
        </Accordion.Collapse>

        <ContextAwareToggle eventKey="1">
          <span>Як довго йтиме замовлення?</span>
        </ContextAwareToggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <ul>
              <li>Замовлення оформлені до 17:00 відправляються цього ж дня</li>
              <li>Термін доставки займає від 1 до 2 днів.</li>
              <li>
                Доставка здійснюється кур'єрською службами «Нова Пошта» і
                «Укрпошта» по Україні
              </li>
            </ul>
          </Card.Body>
        </Accordion.Collapse>

        {/* <ContextAwareToggle eventKey="2">
          <span>Що робити, якщо ELF BAR не працює?</span>
        </ContextAwareToggle>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            <ul>
              <li>Не панікуйте!</li>
              <li>
                <span onClick={handleClick} className="ourMan">
                  Напишіть менеджеру
                </span>{' '}
                і ми вирішимо вашу проблему!
              </li>
            </ul>
          </Card.Body>
        </Accordion.Collapse>

        <ContextAwareToggle eventKey="3">
          <span>У вас оригінальний товар?</span>
        </ContextAwareToggle>
        <Accordion.Collapse eventKey="3">
          <Card.Body>
            <img src={serf} alt="serf" className="imgAcc" /> <br />
            <br />У нашому магазині надано виключно оригінальний товар, який
            легко можна перевірити за QR-кодом на офіційному сайті{' '}
            <a href="https://www.elfbar.com/verify.html">elfbar.com</a>
            <br />
            <br />
            <a href="https://www.youtube.com/watch?v=qsHw_lzxJBg&ab_channel=NovaSens-%D0%92%D0%B5%D0%B9%D0%BF%D1%88%D0%BE%D0%BF%D0%B2%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%D0%B5">
              На відео
            </a>{' '}
            показано, як відрізнити оригінал від підробки
          </Card.Body>
        </Accordion.Collapse> */}
      </Accordion>
    </div>
  );
}

export default Question;
