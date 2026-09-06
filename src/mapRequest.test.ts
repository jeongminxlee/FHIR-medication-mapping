import { test } from 'node:test';
import assert from 'node:assert';
import { mapToMedicationRequest } from './mapRequest';

const amoxicillin = {
  name: 'Amoxicillin 500mg capsules',
  dmdCode: '39732411000001106',
  courseOfTherapy: 'acute' as const,
  doseAmount: 1,
  doseUnit: 'capsule',
  frequency: 3,
  durationDays: 7,
  quantity: 21
};

const sertraline = {
  name: 'Sertraline 50mg tablets',
  dmdCode: '39704111000001102',
  courseOfTherapy: 'continuous' as const,
  doseAmount: 1,
  doseUnit: 'tablet',
  frequency: 1,
  quantity: 28
};

test('a duration produces a boundsDuration', () => {
  const result = mapToMedicationRequest(amoxicillin);
  assert.strictEqual(
    result.dosageInstruction?.[0].timing?.repeat?.boundsDuration?.value,
    7
  );
});

test('no duration means no boundsDuration', () => {
  const result = mapToMedicationRequest(sertraline);
  assert.strictEqual(
    result.dosageInstruction?.[0].timing?.repeat?.boundsDuration,
    undefined
  );
});