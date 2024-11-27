const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour afficher le formulaire de confirmation d'email
app.get('/capture-email', (req, res) => {
  const clientKey = req.query.key;

  if (!clientKey) {
    return res.status(400).send("Clé client manquante.");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmez votre adresse e-mail</title>
    </head>
    <body>
      <h1>Confirmez votre adresse e-mail</h1>
      <form action="/submit-email" method="POST">
        <input type="hidden" name="clientKey" value="${clientKey}">
        <label for="email">Entrez votre e-mail :</label><br>
        <input type="email" id="email" name="email" required><br><br>
        <button type="submit">Confirmer</button>
      </form>
    </body>
    </html>
  `);
});

// Route pour traiter l'envoi de l'email
app.post('/submit-email', (req, res) => {
  const { clientKey, email } = req.body;

  if (!clientKey || !email) {
    return res.status(400).send('Informations manquantes.');
  }

  // Appel à votre webhook Make.com pour mettre à jour le CRM
  const webhookUrl = 'https://hook.eu2.make.com/gdaiwidxxy4k38iby4mo891ddofv3hpy';

  axios.post(webhookUrl, {
    clientKey,
    email
  })
  .then(() => {
    res.send('Merci, votre adresse e-mail a bien été confirmée.');
  })
  .catch((error) => {
    console.error('Erreur lors de l\'envoi au webhook :', error);
    res.status(500).send('Erreur lors de l\'envoi de votre e-mail.');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
