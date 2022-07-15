require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors=require("cors")
mongoose.set('useNewUrlParser',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useCreateIndex',true);
mongoose.set('useUnifiedTopology',true);
mongoose.connect(process.env.CONNECTIONSTRING,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(() => {
    app.listen(process.env.PORT || 3333, () => {
      console.log('Acessar http://localhost:3333');
      console.log('Servidor executando na porta 3333');
    });
  })
  .catch(e => console.log(e));
  const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.use(routes);

