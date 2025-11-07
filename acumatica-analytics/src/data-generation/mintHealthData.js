/**
 * Mint Health - Pharmaceutical & Wellness Data Generator
 * Customized for pharmaceutical distribution business in Malta
 */

const faker = require('faker');

// Mint Health Specific Data

// Malta-based customers (Pharmacies, Clinics, Hospitals)
const MALTA_CUSTOMERS = [
  { name: 'Mater Dei Hospital Pharmacy', type: 'HOSPITAL', location: 'Msida' },
  { name: 'St. James Hospital Pharmacy', type: 'HOSPITAL', location: 'Sliema' },
  { name: 'Karin Grech Hospital', type: 'HOSPITAL', location: 'Pieta' },
  { name: 'Pharmacy of Your Choice - Valletta', type: 'RETAIL', location: 'Valletta' },
  { name: 'Boots Pharmacy Malta', type: 'RETAIL', location: 'Sliema' },
  { name: 'Guardian Pharmacy', type: 'RETAIL', location: 'St. Julians' },
  { name: 'Healthway Pharmacy', type: 'RETAIL', location: 'Birkirkara' },
  { name: 'Medicare Pharmacy', type: 'RETAIL', location: 'Qormi' },
  { name: 'Pavi Pharmacy', type: 'RETAIL', location: 'Paola' },
  { name: 'Plaza Pharmacy', type: 'RETAIL', location: 'Sliema' },
  { name: 'Tower Pharmacy', type: 'RETAIL', location: 'Sliema' },
  { name: 'Unichem Pharmacy', type: 'RETAIL', location: 'Birkirkara' },
  { name: 'Vivian Pharmacy', type: 'RETAIL', location: 'Floriana' },
  { name: 'Wirja Pharmacy', type: 'RETAIL', location: 'Mosta' },
  { name: 'Carmel Pharmacy', type: 'RETAIL', location: 'Naxxar' },
  { name: 'St. Mary Clinic', type: 'CLINIC', location: 'Mosta' },
  { name: 'The Medical Centre', type: 'CLINIC', location: 'Birkirkara' },
  { name: 'Central Medical Clinic', type: 'CLINIC', location: 'Valletta' },
  { name: 'Portomaso Clinic', type: 'CLINIC', location: 'St. Julians' },
  { name: 'Mosta Health Centre', type: 'CLINIC', location: 'Mosta' }
];

// Pharmaceutical products (Mint Health's portfolio)
const PHARMA_PRODUCTS = [
  // Prescription Medications
  { category: 'CARDIOVASCULAR', name: 'Atorvastatin 20mg', type: 'Prescription', price: 15.50, supplier: 'Pfizer' },
  { category: 'CARDIOVASCULAR', name: 'Lisinopril 10mg', type: 'Prescription', price: 12.30, supplier: 'AstraZeneca' },
  { category: 'CARDIOVASCULAR', name: 'Amlodipine 5mg', type: 'Prescription', price: 8.90, supplier: 'Pfizer' },
  { category: 'CARDIOVASCULAR', name: 'Metoprolol 50mg', type: 'Prescription', price: 11.20, supplier: 'AstraZeneca' },

  // Diabetes
  { category: 'DIABETES', name: 'Metformin 500mg', type: 'Prescription', price: 9.50, supplier: 'Bristol Myers' },
  { category: 'DIABETES', name: 'Insulin Glargine', type: 'Prescription', price: 68.00, supplier: 'Sanofi' },
  { category: 'DIABETES', name: 'Gliclazide 80mg', type: 'Prescription', price: 14.50, supplier: 'Servier' },

  // Antibiotics
  { category: 'ANTIBIOTICS', name: 'Amoxicillin 500mg', type: 'Prescription', price: 7.80, supplier: 'GSK' },
  { category: 'ANTIBIOTICS', name: 'Azithromycin 250mg', type: 'Prescription', price: 18.50, supplier: 'Pfizer' },
  { category: 'ANTIBIOTICS', name: 'Ciprofloxacin 500mg', type: 'Prescription', price: 22.00, supplier: 'Bayer' },
  { category: 'ANTIBIOTICS', name: 'Augmentin 625mg', type: 'Prescription', price: 16.90, supplier: 'GSK' },

  // Respiratory
  { category: 'RESPIRATORY', name: 'Ventolin Inhaler', type: 'Prescription', price: 8.50, supplier: 'GSK' },
  { category: 'RESPIRATORY', name: 'Seretide Diskus', type: 'Prescription', price: 52.00, supplier: 'GSK' },
  { category: 'RESPIRATORY', name: 'Montelukast 10mg', type: 'Prescription', price: 18.70, supplier: 'Merck' },

  // Pain & Inflammation
  { category: 'ANALGESICS', name: 'Paracetamol 500mg (100s)', type: 'OTC', price: 3.20, supplier: 'Generic' },
  { category: 'ANALGESICS', name: 'Ibuprofen 400mg (30s)', type: 'OTC', price: 4.50, supplier: 'Nurofen' },
  { category: 'ANALGESICS', name: 'Voltaren Gel 50g', type: 'OTC', price: 9.80, supplier: 'Novartis' },
  { category: 'ANALGESICS', name: 'Panadol Extra (24s)', type: 'OTC', price: 5.60, supplier: 'GSK' },

  // Vitamins & Supplements (Wellness Line)
  { category: 'VITAMINS', name: 'Vitamin D3 1000IU (60s)', type: 'OTC', price: 8.90, supplier: 'Solgar' },
  { category: 'VITAMINS', name: 'Multivitamin Complex (30s)', type: 'OTC', price: 12.50, supplier: 'Centrum' },
  { category: 'VITAMINS', name: 'Omega-3 Fish Oil (90s)', type: 'OTC', price: 18.50, supplier: 'Nordic Naturals' },
  { category: 'VITAMINS', name: 'Vitamin C 1000mg (60s)', type: 'OTC', price: 9.80, supplier: 'Solgar' },
  { category: 'VITAMINS', name: 'Calcium + Vitamin D (60s)', type: 'OTC', price: 11.20, supplier: 'Citracal' },
  { category: 'VITAMINS', name: 'B-Complex Vitamins (100s)', type: 'OTC', price: 14.90, supplier: 'Solgar' },
  { category: 'VITAMINS', name: 'Magnesium 500mg (120s)', type: 'OTC', price: 13.50, supplier: 'Solgar' },
  { category: 'VITAMINS', name: 'Zinc 50mg (100s)', type: 'OTC', price: 10.80, supplier: 'Solgar' },

  // Probiotics & Digestive
  { category: 'DIGESTIVE', name: 'Probiotic Complex (30s)', type: 'OTC', price: 22.50, supplier: 'Culturelle' },
  { category: 'DIGESTIVE', name: 'Gaviscon Liquid 300ml', type: 'OTC', price: 7.80, supplier: 'Reckitt' },
  { category: 'DIGESTIVE', name: 'Buscopan 10mg (20s)', type: 'OTC', price: 6.90, supplier: 'Sanofi' },

  // Allergy & Cold
  { category: 'ALLERGY', name: 'Cetirizine 10mg (30s)', type: 'OTC', price: 5.50, supplier: 'Generic' },
  { category: 'ALLERGY', name: 'Loratadine 10mg (30s)', type: 'OTC', price: 6.20, supplier: 'Clarityn' },
  { category: 'ALLERGY', name: 'Otrivin Nasal Spray', type: 'OTC', price: 7.50, supplier: 'Novartis' },
  { category: 'ALLERGY', name: 'Beconase Nasal Spray', type: 'OTC', price: 11.90, supplier: 'GSK' },

  // Skin Care
  { category: 'SKINCARE', name: 'La Roche Posay Moisturizer', type: 'OTC', price: 18.50, supplier: 'La Roche Posay' },
  { category: 'SKINCARE', name: 'Bepanthen Cream 100g', type: 'OTC', price: 9.80, supplier: 'Bayer' },
  { category: 'SKINCARE', name: 'Cetaphil Cleanser 500ml', type: 'OTC', price: 14.20, supplier: 'Galderma' },
  { category: 'SKINCARE', name: 'Eucerin Eczema Cream', type: 'OTC', price: 16.50, supplier: 'Eucerin' },

  // Baby & Children
  { category: 'BABY', name: 'Calpol 6+ Suspension 100ml', type: 'OTC', price: 5.80, supplier: 'GSK' },
  { category: 'BABY', name: 'Sudocrem 125g', type: 'OTC', price: 6.50, supplier: 'Teva' },
  { category: 'BABY', name: 'Baby Probiotics Drops', type: 'OTC', price: 18.90, supplier: 'BioGaia' },

  // COVID-19 Related
  { category: 'COVID', name: 'COVID Rapid Test (5 pack)', type: 'OTC', price: 12.50, supplier: 'Abbott' },
  { category: 'COVID', name: 'FFP2 Masks (20 pack)', type: 'OTC', price: 9.90, supplier: 'Generic' },
  { category: 'COVID', name: 'Hand Sanitizer 500ml', type: 'OTC', price: 4.50, supplier: 'Dettol' },

  // Women's Health
  { category: 'WOMENS_HEALTH', name: 'Prenatal Vitamins (90s)', type: 'OTC', price: 24.50, supplier: 'Elevit' },
  { category: 'WOMENS_HEALTH', name: 'Folic Acid 400mcg (90s)', type: 'OTC', price: 8.50, supplier: 'Solgar' },

  // Mental Health
  { category: 'MENTAL_HEALTH', name: 'Melatonin 3mg (60s)', type: 'OTC', price: 12.80, supplier: 'Natrol' },
  { category: 'MENTAL_HEALTH', name: 'Magnesium Sleep Complex', type: 'OTC', price: 16.50, supplier: 'Natural Vitality' },

  // Medical Devices & Supplies
  { category: 'MEDICAL_DEVICES', name: 'Blood Glucose Monitor Kit', type: 'OTC', price: 35.00, supplier: 'Abbott' },
  { category: 'MEDICAL_DEVICES', name: 'Digital Thermometer', type: 'OTC', price: 12.50, supplier: 'Braun' },
  { category: 'MEDICAL_DEVICES', name: 'Blood Pressure Monitor', type: 'OTC', price: 45.90, supplier: 'Omron' }
];

// Pharmaceutical suppliers/vendors
const PHARMA_SUPPLIERS = [
  { name: 'Pfizer Europe', country: 'Belgium', terms: 'Net 45' },
  { name: 'GlaxoSmithKline Malta', country: 'Malta', terms: 'Net 30' },
  { name: 'AstraZeneca UK', country: 'UK', terms: 'Net 60' },
  { name: 'Novartis Pharma', country: 'Switzerland', terms: 'Net 45' },
  { name: 'Sanofi Italy', country: 'Italy', terms: 'Net 45' },
  { name: 'Roche Pharmaceuticals', country: 'Switzerland', terms: 'Net 60' },
  { name: 'Merck & Co Europe', country: 'Netherlands', terms: 'Net 45' },
  { name: 'Johnson & Johnson', country: 'Belgium', terms: 'Net 30' },
  { name: 'Bayer Healthcare', country: 'Germany', terms: 'Net 45' },
  { name: 'Bristol Myers Squibb', country: 'UK', terms: 'Net 60' },
  { name: 'Teva Pharmaceuticals', country: 'Israel', terms: 'Net 45' },
  { name: 'Sandoz (Novartis Generic)', country: 'Switzerland', terms: 'Net 45' },
  { name: 'Mylan Pharmaceuticals', country: 'Netherlands', terms: 'Net 30' },
  { name: 'Solgar Vitamins Europe', country: 'UK', terms: 'Net 30' },
  { name: 'Nordic Naturals Europe', country: 'Norway', terms: 'Net 30' }
];

// Malta regions for customer distribution
const MALTA_REGIONS = [
  'Valletta', 'Sliema', 'St. Julians', 'Birkirkara', 'Mosta',
  'Qormi', 'Zabbar', 'Hamrun', 'Naxxar', 'Paola', 'Fgura',
  'Zejtun', 'Rabat', 'Marsaskala', 'Attard', 'Swieqi', 'Mellieha',
  'St. Pauls Bay', 'Marsaxlokk', 'Birzebbuga', 'Siggiewi', 'Dingli',
  'Mdina', 'Floriana', 'Gzira', 'Msida', 'Pieta', 'San Gwann',
  'Santa Venera', 'Tarxien'
];

module.exports = {
  MALTA_CUSTOMERS,
  PHARMA_PRODUCTS,
  PHARMA_SUPPLIERS,
  MALTA_REGIONS
};
