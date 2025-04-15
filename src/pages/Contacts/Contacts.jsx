import s from './Contacts.module.scss';

export const Contacts = () => {
  const handleClick = () => {
    window.open('https://t.me/anatolyi_st', '_blank');
  };
  const handleClickGrupp = () => {
    window.open('https://t.me/+O4zrgmh52CYyYzhi', '_blank');
  };
  const handleClickVBAdmin = () => {
    window.open('viber://add?number=380994363382', '_blank');
  };
  return (
    <>
      <div className={s.contactsBox}>
        <h1>Контакти</h1>
        <button className={s.btnContacts} onClick={handleClick}>
          <span>Зв'язатися з менеджером в Telegram</span>
        </button>
        <br />
        <button onClick={handleClickVBAdmin} className={s.btnContactsVb}>
        <span>Зв'язатися з менеджером в Viber</span>
        </button>
        <br />
        <button className={s.btnContacts} onClick={handleClickGrupp}>
          <span>Підписатися на Telegram</span>
        </button>
      </div>
    </>
  );
};
