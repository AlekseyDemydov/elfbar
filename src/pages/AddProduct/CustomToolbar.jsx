import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

const CustomToolbar = ({ quillRef }) => {
  const editorRef = quillRef; // Отримуємо посилання на редактор Quill

  const handleBold = () => {
    const quill = editorRef.current.getEditor();
    const isBold = quill.getFormat().bold;
    quill.format('bold', !isBold); // Якщо жирний, то відміняємо, інакше застосовуємо
  };

  const handleItalic = () => {
    const quill = editorRef.current.getEditor();
    const isItalic = quill.getFormat().italic;
    quill.format('italic', !isItalic); // Якщо курсив, то відміняємо, інакше застосовуємо
  };

  const handleUnderline = () => {
    const quill = editorRef.current.getEditor();
    const isUnderline = quill.getFormat().underline;
    quill.format('underline', !isUnderline); // Якщо підкреслений, то відміняємо
  };

  const handleStrike = () => {
    const quill = editorRef.current.getEditor();
    const isStrike = quill.getFormat().strike;
    quill.format('strike', !isStrike); // Якщо перекреслений, то відміняємо
  };

  const handleList = () => {
    const quill = editorRef.current.getEditor();
    const isList = quill.getFormat().list;
    quill.format('list', isList ? false : 'ordered'); // Якщо вже є список, то прибираємо, інакше додаємо
  };

  const handleBulletList = () => {
    const quill = editorRef.current.getEditor();
    const isList = quill.getFormat().list;
    quill.format('list', isList ? false : 'bullet'); // Якщо вже є список, то прибираємо, інакше додаємо
  };

  const handleAlign = (alignValue) => {
    const quill = editorRef.current.getEditor();
    quill.format('align', alignValue); // Центрування
  };

  const handleLink = () => {
    const quill = editorRef.current.getEditor();
    const range = quill.getSelection();
    const currentLink = quill.getFormat(range.index, range.length).link;

    if (currentLink) {
      // Якщо є лінк, то відкриваємо його для редагування
      const newUrl = prompt("Редагувати URL", currentLink);
      if (newUrl) {
        quill.formatText(range.index, range.length, 'link', newUrl);
      }
    } else {
      // Якщо лінка немає, то додаємо новий
      const url = prompt("Введіть URL", "https://");
      if (url) {
        quill.formatText(range.index, range.length, 'link', url);
      }
    }
  };

  

  return (
    <div id="toolbar">
     

      {/* Кнопка жирного */}
      <button type="button" onClick={handleBold}>
        <i className="fa fa-bold" />
      </button>

      {/* Кнопка курсива */}
      <button type="button" onClick={handleItalic}>
        <i className="fa fa-italic" />
      </button>

      {/* Кнопка підкреслення */}
      <button type="button" onClick={handleUnderline}>
        <i className="fa fa-underline" />
      </button>

      {/* Кнопка перекреслення */}
      <button type="button" onClick={handleStrike}>
        <i className="fa fa-strikethrough" />
      </button>

      {/* Кнопка нумерованого списку */}
      <button type="button" onClick={handleList}>
        <i className="fa fa-list-ol" />
      </button>

      {/* Кнопка маркованого списку */}
      <button type="button" onClick={handleBulletList}>
        <i className="fa fa-list-ul" />
      </button>

      {/* Кнопки для вирівнювання */}
      <button type="button" onClick={() => handleAlign('left')}>
        <i className="fa fa-align-left" />
      </button>
      <button type="button" onClick={() => handleAlign('center')}>
        <i className="fa fa-align-center" />
      </button>
      <button type="button" onClick={() => handleAlign('right')}>
        <i className="fa fa-align-right" />
      </button>

      {/* Кнопка лінку */}
      <button type="button" onClick={handleLink}>
        <i className="fa fa-link" />
      </button>
    </div>
  );
};

export default CustomToolbar;
