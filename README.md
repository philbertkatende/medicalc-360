# MediCalc 360

MediCalc 360 is an expanding medical and pharmaceutical calculation workspace built with React, TypeScript and Vite.

## Current build

**71 calculator definitions** across:
- Dosage and administration
- IV and infusion calculations
- Compounding and formulation
- General anthropometry
- Fluids and nutrition
- Renal function and electrolytes
- Cardiovascular haemodynamics and risk scores
- Obstetrics and gynaecology
- Neonatology
- Haematology
- Respiratory and critical care
- Neurology and consciousness scoring
- Hepatic assessment
- Oncology dose arithmetic
- Pharmacokinetics and therapeutic drug monitoring
- Epidemiology and biostatistics

## Run locally

```bash
npm install
npm run dev
npm test
npm run build
```

## Clinical governance

**Educational development prototype only. Not a clinically validated medical device, prescribing system or substitute for professional judgement.** Do not use outputs as the sole basis for patient care.

Every calculator displays its equation, source/basis and limitations. A familiar equation or citation does not establish suitability for every population or clinical setting.

Before any calculator is promoted for clinical use:
1. Verify its equation against current primary sources, authoritative references and applicable local guidelines.
2. Define intended population, exclusions, units, accepted input ranges, rounding and interpretation.
3. Add independent expected-value, boundary, regression and clinical scenario tests.
4. Obtain independent review by qualified clinicians/pharmacists.
5. Record reviewer, source version and review date; establish a review cycle.
6. Reassess when guidelines, assays, standards or product information change.

Particular caution is required for paediatric/neonatal dosing, renal dose adjustment, pregnancy, anticoagulation, QT correction, fluid therapy, critical care, oncology and high-alert infusions. Some calculators are approximations or screening scores, not diagnoses or treatment protocols.

## Privacy

The prototype does not request patient names or identifiers. Favourites are stored locally in the browser. Do not enter identifiable patient information.

## Further expansion

Potential future modules include antimicrobial dose optimisation, protocol-linked therapeutic drug monitoring, full obstetric emergency protocols, anaesthesia, toxicology pathways, pharmacy inventory/procurement, pharmaceutical quality control, pharmacoeconomics, research statistics and guideline-linked decision support. These require source verification and clinical review before clinical use.
