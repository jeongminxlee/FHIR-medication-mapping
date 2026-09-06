import { MedicationDispense } from '@medplum/fhirtypes';

type SupplyEvent = {
    name: string;
    dmdCode: string;
    quantity: number;
    unit: string;
    daysSupply: number;
    whenPrepared: string;
    whenHandedOver?: string;
    requestId: string;
};

export function mapToMedicationDispense(
    supply: SupplyEvent
): MedicationDispense {
    const collected = supply.whenHandedOver !== undefined;

    return {
        resourceType: 'MedicationDispense',
        status: collected ? 'completed' : 'in-progress',
        medicationCodeableConcept: {
            coding: [{
                system: 'https://dmd.nhs.uk',
                code: supply.dmdCode,
                display: supply.name
            }]
        },
        subject: { reference: 'Patient/example' },
        authorizingPrescription: [
            { reference: `MedicationRequest/${supply.requestId}` }
        ],
        quantity: { value: supply.quantity, unit: supply.unit },
        daysSupply: { value: supply.daysSupply, unit: 'd' },
        whenPrepared: supply.whenPrepared,
        ...(collected && {
            whenHandedOver: supply.whenHandedOver,
            receiver: [{ reference: 'Patient/example' }]
        }),
        performer: [{
            actor: { reference: 'Organization/pharmacy-example' }
        }],
        substitution: { wasSubstituted: false }
    };
}