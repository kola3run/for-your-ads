const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5001;
const SECRET_KEY = 'your-secret-key'; // Сменить на сложный ключ в продакшене

app.use(express.json());
app.use(cors());

// Подключение к SQLite
const db = new sqlite3.Database('./marketplace.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite');
});

// Создание таблицы пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    phone TEXT,
    verified INTEGER DEFAULT 0
  )
`);

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (email, password, phone) VALUES (?, ?, ?)',
    [email, hashedPassword, phone],
    function (err) {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.json({ message: 'User registered. Verify your phone.' });
    }
  );
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});