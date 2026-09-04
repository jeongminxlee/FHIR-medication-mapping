# FHIR medication mapping

Worked examples mapping UK prescriptions to FHIR R4, from
prescription through to adherence, using dm+d codes.

Written from a pharmacy background learning FHIR. Each example was
chosen because it breaks the mapping in a different way, and each
has a note explaining the decisions and what FHIR couldn't express.

## Examples

| Example | Resource | What it breaks |
|---|---|---|
| [Amoxicillin](examples/medication-request/amoxicillin.md) | MedicationRequest | Acute course; supply vs therapy duration |
| [Paracetamol](examples/medication-request/paracetamol.md) | MedicationRequest | PRN; dose and interval ranges; daily maximum |
| [Sertraline](examples/medication-request/sertraline.md) | MedicationRequest | Dose change over time; two linked authorisations |

## Conventions

- **R4**, because UK Core profiles are R4.
- **dm+d VMP codes** with the `https://dmd.nhs.uk` system URI.
- **Durations in days**, following prescribing shorthand (5/7 is
  five days).
- Validated against the HL7 FHIR validator at R4.0.1.

## Code

`src/mapMedication.ts` converts a simple prescription object into a
valid MedicationRequest, including the clinical logic for whether a
medication is an acute course or continuous therapy.

    npm install
    npx tsx src/test.ts

## Structure

    examples/     worked examples, grouped by resource type
    src/          TypeScript mapping functions