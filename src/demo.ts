import { mapToMedicationRequest } from './mapRequest';

const amoxicillin = mapToMedicationRequest({
  name: 'Amoxicillin 500mg capsules',
  dmdCode: '39732411000001106',
  courseOfTherapy: 'continuous' as const,
  doseAmount: 1,
  doseUnit: 'capsule',
  frequency: 3,
  durationDays: 7,
  quantity: 21
});

console.log(JSON.stringify(amoxicillin, null, 2));


const sertraline = mapToMedicationRequest({
  name: 'Sertraline 50mg tablets',
  dmdCode: '39704111000001102',
  courseOfTherapy: 'continuous' as const,
  doseAmount: 1,
  doseUnit: 'tablet',
  frequency: 1,
  quantity: 28
});

console.log(JSON.stringify(sertraline, null, 2));
