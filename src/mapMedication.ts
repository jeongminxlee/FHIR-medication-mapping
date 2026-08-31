import { MedicationRequest } from '@medplum/fhirtypes';

type PrescriptionInput = {
  name: string;
  dmdCode: string;
  doseAmount: number;
  doseUnit: string;
  frequency: number;
  durationDays?: number;
  quantity: number;
};

export function mapToMedicationRequest(med: PrescriptionInput): MedicationRequest {
  const isAcute = med.durationDays !== undefined;

  const request: MedicationRequest = {
    resourceType: 'MedicationRequest',
    status: 'active',
    intent: 'order',
    courseOfTherapyType: {
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/medicationrequest-course-of-therapy',
        code: isAcute ? 'acute' : 'continuous',
        display: isAcute ? 'Short course (acute) therapy' : 'Continuous long term therapy'
      }]
    },
    medicationCodeableConcept: {
      coding: [{
        system: 'https://dmd.nhs.uk',
        code: med.dmdCode,
        display: med.name
      }]
    },
    subject: { reference: 'Patient/example' },
    dosageInstruction: [{
      timing: {
        repeat: {
          frequency: med.frequency,
          period: 1,
          periodUnit: 'd',
          ...(med.durationDays && {
            boundsDuration: { value: med.durationDays, unit: 'd' }
          })
        }
      },
      doseAndRate: [{
        doseQuantity: { value: med.doseAmount, unit: med.doseUnit }
      }]
    }],
    dispenseRequest: {
      quantity: { value: med.quantity, unit: med.doseUnit },
      ...(med.durationDays && {
        expectedSupplyDuration: { value: med.durationDays, unit: 'd' }
      })
    }
  };

  return request;
}