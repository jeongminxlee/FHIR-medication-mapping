import express from 'express';
import { mapToMedicationRequest } from './mapRequest';
import { mapToMedicationAdministration } from './mapAdministration';
import { mapToMedicationDispense } from './mapDispense';
import { mapToMedicationStatement } from './mapStatement';

const app = express();
app.use(express.json());

function checkFields(body: any, required: string[]) {
  return required.filter(field => body[field] === undefined);
}

app.post('/MedicationRequest', (req, res) => {
  const missing = checkFields(req.body, [
    'name', 'dmdCode', 'doseAmount', 'doseUnit',
    'frequency', 'courseOfTherapy', 'quantity'
  ]);
  if (missing.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', missing });
  }
  res.json(mapToMedicationRequest(req.body));
});

app.post('/MedicationAdministration', (req, res) => {
  const missing = checkFields(req.body, [
    'name', 'dmdCode', 'doseAmount', 'doseUnit',
    'scheduledTime', 'taken', 'requestId'
  ]);
  if (missing.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', missing });
  }
  res.json(mapToMedicationAdministration(req.body));
});

app.post('/MedicationDispense', (req, res) => {
  const missing = checkFields(req.body, [
    'name', 'dmdCode', 'quantity', 'unit',
    'daysSupply', 'whenPrepared', 'requestId'
  ]);
  if (missing.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', missing });
  }
  res.json(mapToMedicationDispense(req.body));
});

app.post('/MedicationStatement', (req, res) => {
  const missing = checkFields(req.body, [
    'name', 'dmdCode', 'doseAmount', 'doseUnit', 'frequency',
    'dosageText', 'startDate', 'dateAsserted', 'sourceReference', 'taking'
  ]);
  if (missing.length > 0) {
    return res.status(400).json({ error: 'Missing required fields', missing });
  }
  res.json(mapToMedicationStatement(req.body));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});