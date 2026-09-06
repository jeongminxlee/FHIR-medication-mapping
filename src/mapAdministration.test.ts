import { test } from 'node:test';
import assert from 'node:assert';
import { mapToMedicationAdministration } from './mapAdministration';

const takenDose = {
    name: 'Amoxicillin 500mg capsules',
    dmdCode: '39732411000001106',
    doseAmount: 1,
    doseUnit: 'capsule',
    scheduledTime: '2026-09-02T08:00:00+01:00',
    taken: true,
    requestId: 'amoxicillin'
};

const missedDose = {
    ...takenDose,
    scheduledTime: '2026-09-02T14:00:00+01:00',
    taken: false,
    notTakenReason: 'Patient forgot'
};

test('a taken dose is completed', () => {
    const result = mapToMedicationAdministration(takenDose);
    assert.strictEqual(result.status, 'completed');
});

test('a missed dose is not-done', () => {
    const result = mapToMedicationAdministration(missedDose);
    assert.strictEqual(result.status, 'not-done');
});

test('a missed dose carries a statusReason', () => {
    const result = mapToMedicationAdministration(missedDose);
    assert.strictEqual(
        result.statusReason?.[0].coding?.[0].display,
        'Patient forgot'
    );
});

test('a taken dose has no statusReason', () => {
    const result = mapToMedicationAdministration(takenDose);
    assert.strictEqual(result.statusReason, undefined);
});