import express from 'express';
import { mapToMedicationRequest } from './mapRequest';
import { mapToMedicationAdministration } from './mapAdministration';
import { mapToMedicationDispense } from './mapDispense';
import { mapToMedicationStatement } from './mapStatement';

const app = express();
app.use(express.json());

app.post('/MedicationRequest', (req, res) => {
  res.json(mapToMedicationRequest(req.body));
});

app.post('/MedicationAdministration', (req, res) => {
  res.json(mapToMedicationAdministration(req.body));
});

app.post('/MedicationDispense', (req, res) => {
  res.json(mapToMedicationDispense(req.body));
});

app.post('/MedicationStatement', (req, res) => {
  res.json(mapToMedicationStatement(req.body));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});