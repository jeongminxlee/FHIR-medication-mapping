# FHIR medication mapping

Worked examples mapping UK prescriptions to FHIR R4, from
prescription through to adherence, using dm+d codes.

Written from a pharmacy background learning FHIR. Each example was
chosen because it breaks the mapping in a different way, and each
has a note explaining the decisions and what FHIR couldn't express.

## The four medication resources

FHIR splits medication into four resources along the prescribing
chain:

| Resource | What it records |
|---|---|
| MedicationRequest | What was ordered |
| MedicationDispense | What was supplied |
| MedicationAdministration | What was taken |
| MedicationStatement | What was reported by the patient |

The first three are sequential: one order, one dispense, many
administrations. MedicationStatement sits outside the chain. It is a report that the sequence took place, resulting
in **a belief that the patient received the medication**.

Two points of contention follow, and both matter for anything
recording adherence.

**1. Administration versus statement.** A patient logging a dose in an
app is asserting a specific event, which is an administration. A
clinician later recording that the patient says they've been taking
it is a statement. But the boundary is unclear when the patient
reports the event themselves. Factors, such as the patient's mental
capacity and age, change how much the report can be relied upon.

**2. Administration assumes a witness.** The structure allows a patient
as `performer.actor`, so self-administration is anticipated. The
vocabularies bolted onto it are not: the suggested codes for why a
dose wasn't given are all forms of refusal, which assumes someone was
there to offer it.

In community care, administration records do not exist at all. The data
stops when the box leaves the pharmacy counter, and adherence is
inferred from reorder frequency, which measures *collection*, not
*consumption*.

## Examples

| Example | Resource | What it breaks |
|---|---|---|
| [Amoxicillin](examples/medication-request/amoxicillin.md) | MedicationRequest | Acute course; supply vs therapy duration |
| [Paracetamol](examples/medication-request/paracetamol.md) | MedicationRequest | PRN; dose and interval ranges; daily maximum |
| [Sertraline](examples/medication-request/sertraline.md) | MedicationRequest | Dose change over time; two linked authorisations |
| [Adherence](examples/medication-administration/adherence.md) | MedicationAdministration | Missed doses; vocabulary assumes refusal |

More prescribing cases *in progress*, inhalers (dose units and devices) and
variable-dose regimens such as a steroid taper, followed by MedicationStatement.

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