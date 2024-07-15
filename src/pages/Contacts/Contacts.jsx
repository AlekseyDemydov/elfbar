import s from './Contacts.module.scss';

export const Contacts = () => {
  const handleClick = () => {
    window.open('https://t.me/anatolyi_st', '_blank');
  };

  return (
    <>
      <div className={s.contactsBox}>
        <h1>Контакти</h1>
        <button className={s.btnContacts} onClick={handleClick}>
          <span>Зв'язатися з менеджером в Telegram</span>
        </button>
      </div>
    </>
  );
};
