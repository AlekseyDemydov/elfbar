import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './AdminLogin.module.scss';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Перевірка імейла та пароля
    if (email === "ivan@gmail.com" && password === "12345") {
      // Зберігаємо імейл в локальному сховищі
      localStorage.setItem('adminEmail', email);
      // Переходимо до головної сторінки
      navigate("/");
    } else {
      setError("Невірний імейл або пароль");
    }
  };

  return (
    <div className={styles['admin-login']}>
      <h2>Вхід для адміністратора</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default AdminLogin;