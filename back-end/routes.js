const express = require('express');
const route = express.Router();
const patientRegisterController = require('./src/controllers/patientRegisterController');

// Rotas de Registro de pacientes.
//C
route.post('/patientRegister',patientRegisterController.register);
//R
route.get('/patientRegister',patientRegisterController.getListPatients);
route.get('/patientRegister/:editId',patientRegisterController.getPatientByIdParams)
//U
route.put('/patientRegister',patientRegisterController.updatePatient);
//D
route.delete('/patientRegister/:id',patientRegisterController.deletePatient);



module.exports = route;
