//importo i metodi di express
const express = require("express");
//creo il router degli utenti / user
const user = express.Router();
//creo il modello dentro la cartella ./models = altro non è che uno schema di creazione della tabella utenti
//vedi la cartella models e poi torna qua
const userModel = require("../models/userModel");

//importo la lib di cript
const bcrypt = require("bcrypt");

//Importo eventuali middlewares
//vedi i file dentro la cartella middelwares per saperne di più
const logger = require("../middlewares/logger");

// creo la GET
// nota, ho messo il middlewares "logger(req)" prima della risposta vera è propria
user.get("/users", async (req, res) => {
  try {
    // UserModel.find è un metodo di mongoose, vedi documentazione mongoose
    // in questo caso, guarda il modello degli utenti
    // fa una get su tutto quello che trova nella tabella che hai indicato nel model
    // ti restituisce un oggetto
    const user = await userModel.find();
    res.status(200).send({
      statusCode: 200,
      user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno",
      error: error,
    });
  }
});

// creo la post
// user.post è un metodo di express.Router, si scrive proprio così
// alla peggio dai un occhio alla documentazione
user.post("/users/create", async (req, res) => {
  //qua devo criptare la passw
  //complessità crypt 10 TOP

  const passwordDiPartenza = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordDiPartenza, salt);

  // creo l'oggetto user partendo da quello che vedo nella req
  const newUser = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    usrImg: req.body.usrImg,
  });
  try {
    // ora mando i dati al database
    // usando il metodo .save che è il metodo mongoose per salvare i dati
    // si scrive proprio così
    const user = await newUser.save();
    res.status(200).send({
      statusCode: 200,
      payload: newUser,
      message: `Utente ${newUser.name} creato correttamente`,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno",
    });
  }
});

// creo la put per modificare i dati
user.patch("/users/update/:userID", async (req, res) => {
  //destrutturo l'url per estrarre l'id
  const { userID } = req.params;
  //verifico che esista l'id
  const userExist = await userModel.findById(userID);
  // se non trova niente restituisce un falsy
  if (!userExist) {
    return res.status(404).send({
      statuscode: 404,
      message: `L'utente con id ${userID} non esiste`,
    });
  }
  try {
    // tiro fuori dalla request i dati da spedire in modifica
    const dataToUpdate = req.body;
    // gli do le options non so perchè ma mettile
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message:
        "Non sono riuscito ad aggiornare l'utente con id ${userID} non esiste",
      error: e,
    });
  }
});

module.exports = user;
