// import React, { useState, useEffect, useRef } from 'react';
// import styles from './Question.module.scss';

// const Dropdown = ({
//   index,
//   openDropdownIndex,
//   handleToggleDropdown,
//   content,
// }) => {
//   const dropdownContentRef = useRef(null);

//   useEffect(() => {
//     if (dropdownContentRef.current) {
//       const dropdownElement = dropdownContentRef.current.closest(`.${styles.dropdown}`);
//       if (dropdownElement) {
//         const dropdownHeight = dropdownContentRef.current.offsetHeight;
//         dropdownElement.style.setProperty('--dropdown-height', `${dropdownHeight}px`);
//       }
//     }
//   }, []);

//   return (
//     <div
//       className={`${styles.dropdown} ${
//         openDropdownIndex === index ? styles.open : ''
//       }`}
//     >
//       <button
//         className={styles.dropdownToggle}
//         onClick={() => handleToggleDropdown(index)}
//       >
//         <span
//           className={`${styles.plus} ${
//             openDropdownIndex === index ? styles.plusOpen : ''
//           }`}
//         ></span>
//         {content.question}
//       </button>
//       <div
//         className={`${styles.dropdownContent} ${
//           openDropdownIndex === index ? styles.open : ''
//         }`}
//         ref={dropdownContentRef}
//         style={{ whiteSpace: 'pre-line' }}
//       >
//         {content.answer}
//       </div>
//     </div>
//   );
// };

// export const Question = () => {
//   const [openDropdownIndex, setOpenDropdownIndex] = useState(-1);

//   const handleToggleDropdown = index => {
//     setOpenDropdownIndex(prevIndex => (prevIndex === index ? -1 : index));
//   };

//   const dropdowns = [
//     {
//       question: 'Як оформити замовлення?',
//       answer: `Виберіть бажаний смак, кількість та залиште заявку на сайті. Скоро з вами зв'яжеться менеджер для уточнення деталей замовлення. Якщо нам не вдасться зв'язатися з вами по телефону, напишемо вам в Telegram або Viber.`,
//     },
//     {
//       question: 'Як довго йтиме замовлення?',
//       answer:
//         "-Замовлення оформлені до 14:00 відправляються цього ж дня \n -Термін доставки займає від 1 до 4 днів. \n -Доставка здійснюється кур'єрською службою «Нова Пошта» по Україні",
//     },
//     {
//       question: 'Що робити, якщо ELF BAR не працює?',
//       answer: (
//         <div
//           dangerouslySetInnerHTML={{
//             __html: `- Не панікуйте! <br /> - <a href="https://t.me/your_manager_username">Напишіть менеджеру</a> і ми вирішимо вашу проблему!`,
//           }}
//         />
//       ),
//     },
//     {
//       question: 'У вас оригінальний товар?',
//       answer: (
//         <div
//           dangerouslySetInnerHTML={{
//             __html: `У нашому магазині надано виключно оригінальний товар, який легко можна перевірити за QR-кодом на офіційному сайті <a href="https://www.elfbar.com/verify.html">elfbar.com</a> <br /> <br /> <a href="https://www.youtube.com/watch?v=qsHw_lzxJBg&ab_channel=NovaSens-%D0%92%D0%B5%D0%B9%D0%BF%D1%88%D0%BE%D0%BF%D0%B2%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%D0%B5">На відео</a> показано, як відрізнити оригінал від підробки`,
//           }}
//         />
//       ),
//     },
//   ];

//   return (
//     <div className={styles.questionContainer}>
//       {dropdowns.map((dropdown, index) => (
//         <Dropdown
//           key={index}
//           index={index}
//           openDropdownIndex={openDropdownIndex}
//           handleToggleDropdown={handleToggleDropdown}
//           content={dropdown}
//         />
//       ))}
//     </div>
//   );
// };





import { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';

const PINK = 'rgba(255, 192, 203, 0.6)';
const BLUE = 'rgba(0, 0, 255, 0.6)';

function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <button
      type="button"
      style={{ backgroundColor: isCurrentEventKey ? PINK : BLUE }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

function Question() {
  return (
    <>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I am the body</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <ContextAwareToggle eventKey="1">Click me!</ContextAwareToggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Hello! I am another body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
}

export default Question;


