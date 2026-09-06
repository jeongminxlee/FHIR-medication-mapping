import { test } from 'node:test';
import assert from 'node:assert';
import { mapToMedicationDispense } from './mapDispense';

const collected = {
    name: 'Sertraline 100mg tablets',
    dmdCode: '39704011000001103',
    quantity: 28,
    unit: 'tablet',
    daysSupply: 28,
    whenPrepared: '2026-08-31T17:00:00+01:00',
    whenHandedOver: '2026-10-02T16:30:00+01:00',
    requestId: 'sertraline-100mg'
};

const uncollected = {
    ...collected,
    whenPrepared: '2026-09-28T17:00:00+01:00',
    whenHandedOver: undefined
};

test('a collected supply is completed', () => {
    const result = mapToMedicationDispense(collected);
    assert.strictEqual(result.status, 'completed');
});

test('an uncollected supply is in-progress', () => {
    const result = mapToMedicationDispense(uncollected);
    assert.strictEqual(result.status, 'in-progress');
});

test('an uncollected supply has no receiver', () => {
    const result = mapToMedicationDispense(uncollected);
    assert.strictEqual(result.receiver, undefined);
});