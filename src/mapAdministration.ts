import { MedicationAdministration } from '@medplum/fhirtypes';

type DoseEvent = {
  name: string;
  dmdCode: string;
  doseAmount: number;
  doseUnit: string;
  scheduledTime: string;
  taken: boolean;
  notTakenReason?: string;
  requestId: string;
};

export function mapToMedicationAdministration(
  dose: DoseEvent
): MedicationAdministration {
  return {
    resourceType: 'MedicationAdministration',
    status: dose.taken ? 'completed' : 'not-done',
    ...(!dose.taken && dose.notTakenReason && {
      statusReason: [{ coding: [{ display: dose.notTakenReason }] }]
    }),
    medicationCodeableConcept: {
      coding: [{
        system: 'https://dmd.nhs.uk',
        code: dose.dmdCode,
        display: dose.name
      }]
    },
    subject: { reference: 'Patient/example' },
    performer: [{ actor: { reference: 'Patient/example' } }],
    effectiveDateTime: dose.scheduledTime,
    request: { reference: `MedicationRequest/${dose.requestId}` },
    dosage: {
      dose: { value: dose.doseAmount, unit: dose.doseUnit }
    }
  };
}