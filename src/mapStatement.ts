import { MedicationStatement } from '@medplum/fhirtypes';

type ReportedMedication = {
  name: string;
  dmdCode: string;
  doseAmount: number;
  doseUnit: string;
  frequency: number;
  dosageText: string;
  startDate: string;
  dateAsserted: string;
  sourceReference: string;
  taking: boolean;
};

export function mapToMedicationStatement(
  reported: ReportedMedication
): MedicationStatement {
  return {
    resourceType: 'MedicationStatement',
    status: reported.taking ? 'active' : 'not-taken',
    medicationCodeableConcept: {
      coding: [{
        system: 'https://dmd.nhs.uk',
        code: reported.dmdCode,
        display: reported.name
      }]
    },
    subject: { reference: 'Patient/example' },
    effectivePeriod: { start: reported.startDate },
    dateAsserted: reported.dateAsserted,
    informationSource: { reference: reported.sourceReference },
    dosage: [{
      text: reported.dosageText,
      timing: {
        repeat: {
          frequency: reported.frequency,
          period: 1,
          periodUnit: 'd'
        }
      },
      doseAndRate: [{
        doseQuantity: { value: reported.doseAmount, unit: reported.doseUnit }
      }]
    }]
  };
}