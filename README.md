# MediCalc 360

An expanding medical and pharmaceutical calculation workspace. The first release establishes the responsive web-app shell, searchable calculator catalogue, transparent calculation outputs, formula explanations and reference/limitation panels.

## Current starter calculators

- Dose-to-volume conversion
- Weight-based dose arithmetic
- IV pump infusion rate
- Gravity drip rate
- Body mass index (adult)
- Body surface area (Mosteller)
- Creatinine clearance (Cockcroft–Gault, adult)
- Anion gap (without potassium)
- Mean arterial pressure estimate
- QT correction (Bazett)
- Estimated date of delivery from LMP
- Gestational age from LMP

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Product principles

1. **Reference-led:** each calculator must have a named source, version/review date and clearly stated assumptions.
2. **Transparent:** show units, formula, intermediate working where appropriate, precision and interpretation limits.
3. **Safe by design:** validate inputs, distinguish estimates from measured values, show clinical warnings and never imply that a score or calculation is a diagnosis.
4. **Modular:** calculators should be independently testable and grouped by clinical or pharmacy domain.
5. **Privacy-conscious:** do not collect or store patient-identifiable information in the initial release.
6. **Accessible:** responsive layout, keyboard support, clear labels and readable contrast.

## Clinical governance — required before clinical deployment

This repository is an early educational prototype, **not a clinically validated medical device or prescribing system**. Do not use its outputs as the sole basis for patient-care decisions.

Before a calculator is promoted for clinical use:
- Verify the equation against a current primary source, guideline or authoritative reference.
- Define the intended population, exclusions, input units, allowable ranges and rounding rules.
- Add independent test cases, boundary tests and regression tests.
- Have the implementation and clinical interpretation independently reviewed by qualified clinicians/pharmacists.
- Record the source, version, reviewer and review date.
- Reassess when guidelines, assays, reference standards or product labels change.

Particular care is required for renal-dose estimation, paediatric/neonatal dosing, pregnancy, QT correction, anticoagulation, electrolyte correction, critical-care scores and chemotherapy dosing. A formula alone is not a complete clinical protocol.

## Planned modules

- Paediatrics and neonatology
- Pharmacokinetics and therapeutic drug monitoring
- Renal dose adjustment and dialysis
- Cardiovascular risk and clinical scores
- Obstetrics and gynaecology
- Critical care, anaesthesia and respiratory calculations
- Electrolytes, acid–base and fluid therapy
- Antimicrobial stewardship and dosing
- Oncology and chemotherapy
- Toxicology and antidotes
- Pharmaceutical compounding, manufacturing and quality control
- Epidemiology, biostatistics and research
- Pharmacoeconomics, procurement and inventory management

## Technology

React, TypeScript and Vite. The app includes a basic web-app manifest and service-worker shell cache; offline behavior will be expanded and tested in a later iteration.
