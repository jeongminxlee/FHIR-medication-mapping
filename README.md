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

Two of these map onto documents you would recognise in practice. A
MAR chart in a hospital is a set of **MedicationAdministration**
records. One signed box per dose. Medicines reconciliation at a
transition of care produces **MedicationStatements**, a statement of patients medication intake, `informationSource` as the source.

Two points of contention follow, and both touch on recording adherence.

**1. Administration versus statement.** A patient logging a dose in an
app is asserting a specific event, which is an administration. A
clinician later recording that the patient says they've been taking
it is a statement. But the boundary is unclear when the patient
reports the event themselves. Factors, such as the patient's mental
capacity and age, change how much the report can be relied upon.

**2. Administration assumes a witness.** The structure allows a patient
as `performer.actor`, so self-administration is anticipated. However, the
vocabularies bolted onto it contradict this: the suggested codes for why a
dose wasn't given are all forms of refusal, which assumes someone was
there to administer it for the patient, meaning self-administration is not expected.

In primary/community care, administration records mostly do not exist. The data
stops being recorded when the medication leaves the pharmacy counter. The adherence then is
inferred from reorder frequency, which measures *collection*, not
*consumption*. Care homes may have MAR charts for every dose, however, they are largely printed on paper and not digitalised. 

## Examples

| Example | Resource | What it breaks |
|---|---|---|
| [Amoxicillin](examples/medication-request/amoxicillin.md) | MedicationRequest | Acute course; supply vs therapy duration |
| [Paracetamol](examples/medication-request/paracetamol.md) | MedicationRequest | PRN; dose and interval ranges; daily maximum |
| [Sertraline](examples/medication-request/sertraline.md) | MedicationRequest | Dose change over time; two linked authorisations |
| [Dispensing a repeat prescription](examples/medication-dispense/sertraline-dispense.md) | MedicationDispense | Issue numbering; uncollected supply; `receiver` limits |
| [Adherence](examples/medication-administration/adherence.md) | MedicationAdministration | Missed doses; vocabulary assumes refusal |
| [Sertraline on admission](examples/medication-statement/sertraline-on-admission.md) | MedicationStatement | Reported vs observed; inferred dates; no partial adherence |

More prescribing cases *in-progress*, inhalers (dose units and devices) and
variable-dose regimens such as a steroid taper, followed by more cases of MedicationStatement.

## Conventions

- **R4.** UK Core profiles use R4.
- **dm+d VMP codes** with the `https://dmd.nhs.uk` system URI.
- **Durations in days**, following prescribing shorthand (5/7 is
  five days).
- Validated against the HL7 FHIR validator at R4.0.1.

## Code

`src/` contains a mapping function for each resource, converting a
simple input object into valid FHIR:

- `mapRequest.ts` — MedicationRequest
- `mapDispense.ts` — MedicationDispense
- `mapAdministration.ts` — MedicationAdministration
- `mapStatement.ts` — MedicationStatement

Three of them encode the clinical decision that resource turns on:
whether a dose was taken, whether a supply was collected, whether the
patient is still taking the medication. Tests cover those decisions.

`mapRequest.ts` takes the course of therapy as an input rather than
inferring it from the presence of a duration. A duration does not
reliably imply an acute course — the sertraline example is continuous
therapy with a 28-day bound.

    npm install
    npm test
    npx tsx src/demo.ts

## API

The mappers are also exposed over HTTP. Start the server:

    npm install
    npm start

Then POST a simple object to the endpoint for the resource you want:

    curl -X POST http://localhost:3000/MedicationRequest \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Amoxicillin 500mg capsules",
        "dmdCode": "39732411000001106",
        "doseAmount": 1,
        "doseUnit": "capsule",
        "frequency": 3,
        "courseOfTherapy": "acute",
        "durationDays": 7,
        "quantity": 21
      }'

The response is a valid FHIR R4 MedicationRequest.

Endpoints: `/MedicationRequest`, `/MedicationDispense`,
`/MedicationAdministration`, `/MedicationStatement`. Missing required
fields return a 400 listing what is absent.

## Structure

    examples/     worked examples, grouped by resource type
    src/          mapping functions, tests, and the HTTP server