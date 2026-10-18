const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, 'medicines_data.json'), 'utf-8');
const medicines = JSON.parse(rawData);

console.log(`Loaded ${medicines.length} medicines from JSON.`);

// Check duplicate IDs
const ids = new Set();
for (const med of medicines) {
  if (ids.has(med.id)) {
    console.error(`Duplicate ID found: ${med.id}`);
  }
  ids.add(med.id);
}
console.log(`Unique medicine IDs count: ${ids.size}`);

// 1. Update frontend/src/data/medicines.ts
const frontendFile = path.join(__dirname, '../frontend/src/data/medicines.ts');
const frontendContent = `import type { Medicine } from '../types';

export const initialMedicines: Medicine[] = ${JSON.stringify(medicines, null, 2)};
`;
fs.writeFileSync(frontendFile, frontendContent, 'utf-8');
console.log(`Successfully updated ${frontendFile}`);

// 2. Update backend/src/data/initialData.ts
const backendInitialDataFile = path.join(__dirname, '../backend/src/data/initialData.ts');
let backendContent = fs.readFileSync(backendInitialDataFile, 'utf-8');

// Replace initialMedicines array in initialData.ts
const medStart = backendContent.indexOf('export const initialMedicines: Medicine[] = [');
const medEnd = backendContent.indexOf('export const initialPharmacies: Pharmacy[] = [');

if (medStart !== -1 && medEnd !== -1) {
  const newMedicinesSection = `export const initialMedicines: Medicine[] = ${JSON.stringify(medicines, null, 2)};\n\n`;
  backendContent = backendContent.substring(0, medStart) + newMedicinesSection + backendContent.substring(medEnd);
  fs.writeFileSync(backendInitialDataFile, backendContent, 'utf-8');
  console.log(`Successfully updated ${backendInitialDataFile}`);
} else {
  console.error('Could not locate initialMedicines section in backend/src/data/initialData.ts');
}

// 3. Update backend/data/db.json if present
const dbJsonFile = path.join(__dirname, '../backend/data/db.json');
if (fs.existsSync(dbJsonFile)) {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbJsonFile, 'utf-8'));
    dbData.medicines = medicines;
    fs.writeFileSync(dbJsonFile, JSON.stringify(dbData, null, 2), 'utf-8');
    console.log(`Successfully updated ${dbJsonFile}`);
  } catch (err) {
    console.error('Failed to update db.json:', err);
  }
}

// 4. Update backend/seed.py
const seedPyFile = path.join(__dirname, '../backend/seed.py');
if (fs.existsSync(seedPyFile)) {
  let seedContent = fs.readFileSync(seedPyFile, 'utf-8');
  const pyMedStart = seedContent.indexOf('initial_medicines = [');
  const pyMedEnd = seedContent.indexOf('initial_pharmacies = [');

  if (pyMedStart !== -1 && pyMedEnd !== -1) {
    // Convert medicines to Python dict representation
    const pyMeds = medicines.map(m => {
      return `            {
                "id": ${JSON.stringify(m.id)},
                "name": ${JSON.stringify(m.name)},
                "generic_name": ${JSON.stringify(m.genericName)},
                "brand_name": ${JSON.stringify(m.brandName)},
                "manufacturer": ${JSON.stringify(m.manufacturer)},
                "category": ${JSON.stringify(m.category)},
                "dosage_form": ${JSON.stringify(m.dosageForm)},
                "strength": ${JSON.stringify(m.strength)},
                "uses": ${JSON.stringify(m.uses)},
                "precautions": ${JSON.stringify(m.precautions)},
                "side_effects": ${JSON.stringify(m.sideEffects)},
                "storage": ${JSON.stringify(m.storage)},
                "prescription_required": ${m.prescriptionRequired ? 'True' : 'False'},
                "availability_status": ${JSON.stringify(m.availabilityStatus)},
                "price": ${m.price},
                "description": ${JSON.stringify(m.description)},
                "drug_interactions": ${JSON.stringify(m.drugInteractions)},
                "stock_count": ${m.stockCount}
            }`;
    }).join(',\n');

    const pySection = `initial_medicines = [\n${pyMeds}\n        ]\n\n        `;
    seedContent = seedContent.substring(0, pyMedStart) + pySection + seedContent.substring(pyMedEnd);
    fs.writeFileSync(seedPyFile, seedContent, 'utf-8');
    console.log(`Successfully updated ${seedPyFile}`);
  }
}
