import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message || !email.includes('@')) {
    return res.status(400).json({ error: 'Données invalides ou manquantes.' });
  }

  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    date: new Date().toISOString()
  };

  const messagesFilePath = path.join(__dirname, 'messages.json');
  let messages = [];

  try {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
  } catch (err) {
    // Le fichier n'existe pas encore, on garde le tableau vide.
  }

  messages.push(newMessage);
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

  res.status(200).json({ success: true, message: 'Message reçu.' });
});

app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
});
