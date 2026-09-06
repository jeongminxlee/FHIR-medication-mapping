import { test } from 'node:test';
import assert from 'node:assert';
import { mapToMedicationStatement } from './mapStatement';

const reported = {
  name: 'Sertraline 100mg tablets',
  dmdCode: '39704011000001103',
  doseAmount: 1,
  doseUnit: 'tablet',
  frequency: 1,
  dosageText: 'One tablet daily',
  startDate: '2026-09-06',
  dateAsserted: '2026-11-15T10:30:00+00:00',
  sourceReference: 'Patient/example',
  taking: true
};

const stopped = { ...reported, taking: false };

test('a medication being taken is active', () => {
  const result = mapToMedicationStatement(reported);
  assert.strictEqual(result.status, 'active');
});

test('a medication no longer taken is not-taken', () => {
  const result = mapToMedicationStatement(stopped);
  assert.strictEqual(result.status, 'not-taken');
});

test('the information source passes through', () => {
  const result = mapToMedicationStatement({
    ...reported,
    sourceReference: 'RelatedPerson/daughter-example'
  });
  assert.strictEqual(
    result.informationSource?.reference,
    'RelatedPerson/daughter-example'
  );
});