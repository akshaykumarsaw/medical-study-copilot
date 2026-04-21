export type View = 'body' | 'brain';

export interface OrganStat { label: string; value: string; }
export interface OrganData {
  id: string;
  name: string;
  view: View;
  overview: { description: string; stats: OrganStat[] };
  function: string;
  clinical: { conditions: string[]; note: string };
  related: string[];
}

export const ORGAN_DATABASE: Record<string, OrganData> = {

  /* ══════════════ BODY ORGANS ═════════════ */

  UBERON_0000948: {
    id: 'UBERON_0000948', name: 'Heart', view: 'body',
    overview: {
      description: 'The heart is a four-chambered muscular organ situated in the mediastinum, between the two lungs. It generates the pressure gradient required to drive blood through approximately 60,000 miles of blood vessels, completing each full circuit in under a minute.',
      stats: [{ label: 'Weight', value: '250–350 g' }, { label: 'Rate', value: '60–100 bpm' }, { label: 'Stroke vol.', value: '70 mL' }, { label: 'Cardiac output', value: '5–6 L/min' }],
    },
    function: 'The sinoatrial (SA) node generates rhythmic depolarisations at 60–100 per minute. Impulses propagate through the atrioventricular (AV) node and bundle of His to the Purkinje network, producing synchronised ventricular contraction. Systole ejects ~70 mL per beat; diastole fills the chambers. The coronary arteries supply the myocardium during diastole.',
    clinical: { conditions: ['Myocardial Infarction', 'Heart Failure', 'Atrial Fibrillation', 'Aortic Stenosis', 'Dilated Cardiomyopathy'], note: 'STEMI diagnosis: ST elevation ≥ 1 mm in ≥ 2 contiguous limb leads, or ≥ 2 mm in precordial leads. Troponin I/T > 99th percentile URL confirms myocardial necrosis. Target door-to-balloon time < 90 minutes.' },
    related: ['UBERON_0000947', 'UBERON_0002048', 'UBERON_0001621', 'UBERON_0002084'],
  },

  UBERON_0002048: {
    id: 'UBERON_0002048', name: 'Lung', view: 'body',
    overview: {
      description: 'The paired lungs are spongy, elastic organs occupying the pleural cavities on either side of the mediastinum. The right lung has three lobes; the left has two. Total alveolar surface area is approximately 70 m².',
      stats: [{ label: 'Total capacity', value: '6 L' }, { label: 'Tidal volume', value: '500 mL' }, { label: 'Alveoli', value: '~300 million' }, { label: 'Resp. rate', value: '12–20 /min' }],
    },
    function: 'Gas exchange occurs at the alveolo-capillary membrane: O₂ diffuses down its partial pressure gradient into blood; CO₂ diffuses out. Ventilation-perfusion (V/Q) matching optimises efficiency. Surfactant (dipalmitoylphosphatidylcholine) reduces surface tension, preventing alveolar collapse at end-expiration.',
    clinical: { conditions: ['Pneumonia', 'COPD', 'Pulmonary Embolism', 'Lung Adenocarcinoma', 'ARDS'], note: 'Berlin criteria for ARDS: acute onset within 7 days, bilateral infiltrates on CXR, PaO₂/FiO₂ < 300 mmHg. Most common lung cancer is adenocarcinoma (peripheral, non-smokers included). ABG: normal PaO₂ 80–100 mmHg, PaCO₂ 35–45 mmHg.' },
    related: ['UBERON_0003126', 'UBERON_0002185', 'UBERON_0001103', 'UBERON_0000977'],
  },

  UBERON_0002107: {
    id: 'UBERON_0002107', name: 'Liver', view: 'body',
    overview: {
      description: 'The largest solid organ, weighing 1.2–1.5 kg, occupying the right hypochondrium. It receives dual blood supply: 75% portal venous (nutrient-rich) and 25% hepatic arterial (oxygenated). Contains ~100 billion hepatocytes.',
      stats: [{ label: 'Weight', value: '1.2–1.5 kg' }, { label: 'Blood flow', value: '1.5 L/min' }, { label: 'Bile/day', value: '500–1000 mL' }, { label: 'Regeneration', value: '≥ 70% resection' }],
    },
    function: 'Metabolic hub: gluconeogenesis, glycogen synthesis, lipid metabolism, protein synthesis (albumin, clotting factors), detoxification of ammonia (urea cycle), drug metabolism (CYP450 enzymes), bile acid synthesis for fat emulsification. Kupffer cells provide innate immune surveillance.',
    clinical: { conditions: ['Cirrhosis', 'Hepatocellular Carcinoma', 'Hepatitis B/C', 'NAFLD/NASH', 'Drug-induced Hepatotoxicity'], note: 'Child-Pugh score (bilirubin, albumin, PT, ascites, encephalopathy) stratifies cirrhosis severity. MELD score guides transplant listing. Paracetamol overdose → N-acetylcysteine within 8 hours of ingestion to prevent fulminant failure.' },
    related: ['UBERON_0002110', 'UBERON_0001264', 'UBERON_0000945', 'UBERON_0002106'],
  },

  UBERON_0000945: {
    id: 'UBERON_0000945', name: 'Stomach', view: 'body',
    overview: {
      description: 'A J-shaped muscular sac in the left upper abdomen with a capacity of 1–1.5 L. Divided into cardia, fundus, body, antrum, and pylorus. Contains HCl (pH 1.5–3.5) and pepsinogen.',
      stats: [{ label: 'Capacity', value: '1–1.5 L' }, { label: 'Gastric acid pH', value: '1.5–3.5' }, { label: 'Emptying time', value: '2–5 hours' }, { label: 'Parietal cells', value: 'HCl + IF' }],
    },
    function: 'Mechanical breakdown (rugal folds, peristalsis) converts food to chyme. Parietal cells secrete HCl (via H⁺/K⁺-ATPase) and intrinsic factor (for B12 absorption). Chief cells secrete pepsinogen → pepsin (protein digestion). G-cells secrete gastrin, stimulating acid production.',
    clinical: { conditions: ['Peptic Ulcer Disease', 'Gastric Carcinoma', 'GERD', 'Helicobacter pylori Infection', 'Zollinger-Ellison Syndrome'], note: 'H. pylori: gram-negative, urease-positive, colonises antrum. Triple therapy: PPI + clarithromycin + amoxicillin × 14 days. Virchow\'s node (left supraclavicular) is a classic sign of gastric carcinoma metastasis. Intrinsic factor loss causes pernicious anaemia.' },
    related: ['UBERON_0002107', 'UBERON_0002114', 'UBERON_0001043', 'UBERON_0001264'],
  },

  UBERON_0002113: {
    id: 'UBERON_0002113', name: 'Kidney', view: 'body',
    overview: {
      description: 'Bean-shaped retroperitoneal organs, each ~11 × 6 × 3 cm, weighing 150 g. Contains ~1 million nephrons. Filters ~180 L of plasma daily, producing ~1.5 L of urine.',
      stats: [{ label: 'GFR', value: '90–120 mL/min' }, { label: 'Plasma filtered', value: '180 L/day' }, { label: 'Urine output', value: '1–1.5 L/day' }, { label: 'Nephrons', value: '~1 million' }],
    },
    function: 'Four distinct functions: filtration (glomerulus), reabsorption (PCT: 65% Na/water, loop of Henle: countercurrent multiplication), secretion (organic acids, K⁺, H⁺), and excretion. Also produces erythropoietin (EPO), renin (RAAS activation), and activates vitamin D (1,25-dihydroxycholecalciferol).',
    clinical: { conditions: ['Acute Kidney Injury', 'CKD', 'Nephrotic Syndrome', 'Renal Cell Carcinoma', 'Polycystic Kidney Disease'], note: 'CKD staged by GFR (G1-G5) and albuminuria (A1-A3). KDIGO defines AKI as: Cr rise ≥ 0.3 mg/dL in 48 hrs, or ≥ 1.5× baseline in 7 days. Nephrotic: proteinuria > 3.5 g/day + hypoalbuminaemia + oedema. Nephritic: haematuria + HTN + oliguria.' },
    related: ['UBERON_0001255', 'UBERON_0002369'],
  },

  UBERON_0002106: {
    id: 'UBERON_0002106', name: 'Spleen', view: 'body',
    overview: {
      description: 'The largest lymphoid organ, weighing 150 g in adults, located in the left hypochondrium beneath the 9th–11th ribs. Blood-red pulp filters blood; white pulp provides immune surveillance.',
      stats: [{ label: 'Weight', value: '100–200 g' }, { label: 'Blood flow', value: '350 mL/min' }, { label: 'Red cells culled', value: '~120 days old' }, { label: 'Platelet reserve', value: '~30%' }],
    },
    function: 'Red pulp: removes senescent erythrocytes via splenic sinusoids, recycles haemoglobin iron. White pulp: T-cell periarteriolar lymphoid sheaths (PALS) and B-cell follicles mount immune responses to blood-borne antigens, particularly encapsulated bacteria. Stores platelets and monocytes; site of extramedullary haematopoiesis in disease.',
    clinical: { conditions: ['Splenomegaly', 'Splenic Rupture', 'Hypersplenism', 'Splenic Infarction', 'Post-splenectomy Sepsis'], note: 'Asplenic patients require vaccines: pneumococcal, Hib, meningococcal, influenza. High risk of overwhelming post-splenectomy infection (OPSI) from Streptococcus pneumoniae, Haemophilus influenzae, Neisseria meningitidis. Consider prophylactic amoxicillin.' },
    related: ['UBERON_0002107', 'UBERON_0000029', 'UBERON_0002371'],
  },

  UBERON_0001264: {
    id: 'UBERON_0001264', name: 'Pancreas', view: 'body',
    overview: {
      description: 'A retroperitoneal gland 12–15 cm long with exocrine (acinar cells, 99%) and endocrine (islets of Langerhans, 1%) components. Produces ~1.5 L of alkaline juice per day.',
      stats: [{ label: 'Length', value: '12–15 cm' }, { label: 'Juice/day', value: '1.5 L' }, { label: 'Islet β-cells', value: 'Insulin' }, { label: 'Islet α-cells', value: 'Glucagon' }],
    },
    function: 'Exocrine: acinar cells secrete digestive proenzymes (trypsinogen, chymotrypsinogen, lipase) — activated by enteropeptidase in duodenum; ductal cells secrete bicarbonate (pH 8) to neutralise gastric acid. Endocrine: β-cells release insulin (glucose uptake), α-cells release glucagon (glycogenolysis), δ-cells release somatostatin (inhibitor).',
    clinical: { conditions: ['Acute Pancreatitis', 'Chronic Pancreatitis', 'Pancreatic Ductal Adenocarcinoma', 'Type 1/2 Diabetes', 'Insulinoma'], note: 'Ranson\'s criteria stratify acute pancreatitis severity. Causes: gallstones (40%), alcohol (35%). Pancreatic cancer: painless obstructive jaundice + Courvoisier\'s sign (palpable non-tender gallbladder). CA 19-9 is a tumour marker (not diagnostic). ERCP/MRCP for ductal assessment.' },
    related: ['UBERON_0002107', 'UBERON_0002110', 'UBERON_0002114', 'UBERON_0000945'],
  },

  UBERON_0002110: {
    id: 'UBERON_0002110', name: 'Gall Bladder', view: 'body',
    overview: {
      description: 'A pear-shaped sac, 7–10 cm long, attached to the inferior surface of the liver. Stores and concentrates bile 5–10 fold by absorbing water and electrolytes between meals.',
      stats: [{ label: 'Capacity', value: '30–60 mL' }, { label: 'Bile concentration', value: '5–10×' }, { label: 'Wall thickness', value: '< 3 mm normal' }, { label: 'Emptying trigger', value: 'CCK' }],
    },
    function: 'Cholecystokinin (CCK), released by duodenal I-cells in response to dietary fat and protein, triggers gallbladder contraction and sphincter of Oddi relaxation. Bile emulsifies dietary fats into micelles, facilitating lipase action and absorption of fat-soluble vitamins (A, D, E, K).',
    clinical: { conditions: ['Cholelithiasis', 'Acute Cholecystitis', 'Choledocholithiasis', 'Cholangitis', 'Gallbladder Carcinoma'], note: 'Charcot\'s triad (cholangitis): RUQ pain + fever + jaundice. Reynolds\' pentad adds hypotension and altered consciousness. Murphy\'s sign: inspiratory arrest on palpation of RUQ. Ultrasound is first-line imaging. ERCP for stone extraction from CBD.' },
    related: ['UBERON_0002107', 'UBERON_0001264'],
  },

  UBERON_0001155: {
    id: 'UBERON_0001155', name: 'Colon', view: 'body',
    overview: {
      description: 'The large intestine, ~1.5 m long, frames the abdominal cavity. Comprises caecum, ascending, transverse, descending, and sigmoid colon, and rectum. Lacks villi; contains haustra and taeniae coli.',
      stats: [{ label: 'Length', value: '~1.5 m' }, { label: 'Diameter', value: '6.5 cm (caecum)' }, { label: 'Transit time', value: '24–72 hours' }, { label: 'Water absorbed', value: '1.5–2 L/day' }],
    },
    function: 'Primary role: absorb water and electrolytes from 1.5 L of ileal effluent, converting it to solid stool. Colonic bacteria (microbiome: ~100 trillion organisms) ferment undigested carbohydrates to short-chain fatty acids (butyrate: colonocyte fuel). Propulsion via haustral contractions and mass movements.',
    clinical: { conditions: ['Colorectal Carcinoma', 'Inflammatory Bowel Disease', 'Diverticular Disease', 'Ischaemic Colitis', 'C. difficile Colitis'], note: 'CRC screening: colonoscopy from age 45 (or 40 if family history). Lynch syndrome (HNPCC): autosomal dominant, MLH1/MSH2 mutations. FAP: APC gene mutation, > 100 polyps, colectomy required. CEA is a monitoring (not diagnostic) tumour marker.' },
    related: ['UBERON_0002108', 'UBERON_0001153', 'UBERON_0001052', 'UBERON_0001154'],
  },

  UBERON_0002108: {
    id: 'UBERON_0002108', name: 'Small Intestine', view: 'body',
    overview: {
      description: 'A highly folded tube, 6–7 m in length, comprising duodenum (25 cm), jejunum (2.5 m), and ileum (3.5 m). Mucosal surface area ~200 m² via plicae circulares, villi, and microvilli (brush border).',
      stats: [{ label: 'Length', value: '6–7 m' }, { label: 'Surface area', value: '~200 m²' }, { label: 'Transit time', value: '2–6 hours' }, { label: 'Absorption', value: '8–9 L/day' }],
    },
    function: 'Primary site of nutrient absorption. Duodenum: receives bile and pancreatic juice. Jejunum: absorbs 90% of nutrients (carbohydrates as glucose/fructose, proteins as amino acids, fats as fatty acids via lymphatics). Ileum: reabsorbs bile salts (enterohepatic circulation), absorbs B12 (intrinsic factor complex), fat-soluble vitamins.',
    clinical: { conditions: ['Coeliac Disease', 'Crohn\'s Disease', 'Small Bowel Obstruction', 'Carcinoid Tumour', 'Meckel\'s Diverticulum'], note: 'Coeliac: anti-TTG IgA + duodenal biopsy (villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis). Crohn\'s disease: transmural, skip lesions, rosette sign on barium, cobblestone mucosa. Terminal ileum most commonly affected. Anti-TNF agents: infliximab, adalimumab.' },
    related: ['UBERON_0002114', 'UBERON_0001155', 'UBERON_0001264'],
  },

  UBERON_0001255: {
    id: 'UBERON_0001255', name: 'Urinary Bladder', view: 'body',
    overview: {
      description: 'A hollow, distensible muscular organ in the pelvis. Capacity 400–600 mL; micturition urge at ~200–300 mL. Wall composed of detrusor muscle (smooth muscle).',
      stats: [{ label: 'Capacity', value: '400–600 mL' }, { label: 'Urge threshold', value: '200–300 mL' }, { label: 'Epithelium', value: 'Transitional (urothelium)' }, { label: 'Wall', value: 'Detrusor muscle' }],
    },
    function: 'Stores urine from ureters via passive filling (detrusor relaxation mediated by sympathetic β3 stimulation). Micturition: parasympathetic M3 receptor activation → detrusor contraction + internal sphincter relaxation. External sphincter under voluntary (pudendal nerve, S2–4) control.',
    clinical: { conditions: ['Bladder Cancer', 'UTI/Cystitis', 'Overactive Bladder', 'Urinary Retention', 'Neurogenic Bladder'], note: 'Painless haematuria in > 40s: rule out bladder carcinoma. TCC (transitional cell carcinoma) = most common. Risk factors: smoking, aniline dyes, cyclophosphamide. Cystoscopy + biopsy: definitive diagnosis. BCG intravesical therapy for non-muscle-invasive disease.' },
    related: ['UBERON_0002113', 'UBERON_0002367'],
  },

  UBERON_0002046: {
    id: 'UBERON_0002046', name: 'Thyroid Gland', view: 'body',
    overview: {
      description: 'A butterfly-shaped bilobed endocrine gland at the base of the neck, weighing 20–30 g. Highly vascular; receives 80–120 mL/min of blood. Follicles store thyroglobulin (colloid).',
      stats: [{ label: 'Weight', value: '20–30 g' }, { label: 'Blood flow', value: '80–120 mL/min' }, { label: 'T4 half-life', value: '7 days' }, { label: 'T3 half-life', value: '1 day' }],
    },
    function: 'Follicular cells synthesise thyroxine (T4) and triiodothyronine (T3) from tyrosine + iodine, regulated by TSH (pituitary). T3 is the active form (4× more potent); most T4 is peripherally deiodinated to T3. Actions: increase BMR, heart rate, bone turnover, gut motility, and foetal brain development. Parafollicular C-cells produce calcitonin (calcium regulation).',
    clinical: { conditions: ['Hypothyroidism', 'Hyperthyroidism (Graves\')', 'Hashimoto\'s Thyroiditis', 'Thyroid Nodule/Cancer', 'Thyroid Storm'], note: 'Hashimoto\'s: most common cause of hypothyroidism in iodine-sufficient regions. Anti-TPO + anti-thyroglobulin antibodies. Graves\': TSI (thyroid-stimulating immunoglobulin) → hyperthyroidism + exophthalmos + pretibial myxoedema. Thyroid storm: ICU emergency; propranolol + PTU + iodine + steroids.' },
    related: ['UBERON_0000007', 'UBERON_0002369'],
  },

  UBERON_0002369: {
    id: 'UBERON_0002369', name: 'Adrenal Gland', view: 'body',
    overview: {
      description: 'Paired suprarenal glands atop each kidney. Each weighs ~4–5 g with an outer cortex (3 zones) and an inner medulla. Critical for stress response and homeostasis.',
      stats: [{ label: 'Weight', value: '4–5 g each' }, { label: 'Cortex zones', value: '3 (GFR rule)' }, { label: 'Medulla', value: 'Catecholamines' }, { label: 'Cortisol peak', value: '8 AM' }],
    },
    function: 'Cortex (outside-in): Zona Glomerulosa → aldosterone (mineralocorticoid: Na⁺ retention, K⁺ excretion, RAAS-regulated). Zona Fasciculata → cortisol (glucocorticoid: stress response, gluconeogenesis, anti-inflammatory). Zona Reticularis → androgens (DHEA). Medulla: chromaffin cells secrete adrenaline (80%) and noradrenaline (20%) — "fight-or-flight".',
    clinical: { conditions: ['Cushing\'s Syndrome', 'Addison\'s Disease', 'Conn\'s Syndrome', 'Phaeochromocytoma', 'Congenital Adrenal Hyperplasia'], note: 'Addisonian crisis: life-threatening—hypotension, hyponatraemia, hyperkalaemia. Treat: IV hydrocortisone 100 mg immediately, IV saline. Phaeochromocytoma: "rule of 10s" — 10% malignant, bilateral, extra-adrenal, familial. Diagnose with 24-hr urine metanephrines or plasma metanephrines. Never biopsy without blocking α-receptors first.' },
    related: ['UBERON_0002113', 'UBERON_0002046'],
  },

  UBERON_0000947: {
    id: 'UBERON_0000947', name: 'Aorta', view: 'body',
    overview: {
      description: 'The body\'s largest artery, originating from the left ventricle. Diameter: ~2.5 cm at root, 1.5–1.8 cm in abdomen. Elastic wall stores systolic energy and releases it during diastole (Windkessel effect).',
      stats: [{ label: 'Root diameter', value: '~2.5 cm' }, { label: 'Pressure', value: '120/80 mmHg' }, { label: 'Length', value: '~30 cm' }, { label: 'Peak flow', value: '~200 mL/s' }],
    },
    function: 'Distributes oxygenated blood to systemic circulation. Ascending aorta → coronary arteries; aortic arch → brachiocephalic, left common carotid, left subclavian; descending thoracic → intercostals, bronchials; abdominal → celiac, SMA, IMA, renals, iliac. Elastic recoil maintains diastolic pressure.',
    clinical: { conditions: ['Aortic Aneurysm', 'Aortic Dissection', 'Aortic Stenosis', 'Coarctation', 'Atherosclerosis'], note: 'Abdominal aortic aneurysm (AAA): screen men 65+ with one-time ultrasound. Elective repair if > 5.5 cm or rapidly expanding. Type A dissection (ascending): emergency surgical repair. Type B (descending): medical management (IV labetalol to target SBP 100–120). Imaging of choice: CT angiography.' },
    related: ['UBERON_0000948', 'UBERON_0001621'],
  },

  UBERON_0003126: {
    id: 'UBERON_0003126', name: 'Trachea', view: 'body',
    overview: {
      description: 'A cartilaginous tube 10–12 cm long, 1.5–2 cm diameter, from the cricoid cartilage (C6) to the carina (T4/5). Supported by 16–20 C-shaped hyaline cartilage rings.',
      stats: [{ label: 'Length', value: '10–12 cm' }, { label: 'Diameter', value: '1.5–2 cm' }, { label: 'Rings', value: '16–20' }, { label: 'Carina level', value: 'T4/T5' }],
    },
    function: 'Conducts air between larynx and bronchi. Pseudostratified ciliated columnar epithelium (with goblet cells) forms the mucociliary escalator — cilia beat at 1000/min, clearing mucus and particles superiorly at ~10 mm/min.',
    clinical: { conditions: ['Tracheal Stenosis', 'Foreign Body Aspiration', 'Tracheomalacia', 'Tracheoesophageal Fistula', 'Tracheal Tumours'], note: 'Foreign body aspiration: most commonly into the right main bronchus (more vertical, wider). Signs: sudden onset cough, wheeze, absent breath sounds. Chest X-ray may show hyperinflation. Rigid bronchoscopy is the definitive treatment.' },
    related: ['UBERON_0002048', 'UBERON_0002185', 'UBERON_0000341'],
  },

  UBERON_0001043: {
    id: 'UBERON_0001043', name: 'Esophagus', view: 'body',
    overview: {
      description: 'A muscular tube 25–30 cm long connecting the pharynx (C6) to the stomach (T10 oesophageal hiatus). Three natural constrictions: cricoid (15 cm), aortic arch (22.5 cm), diaphragm (40 cm from incisors).',
      stats: [{ label: 'Length', value: '25–30 cm' }, { label: 'Upper third', value: 'Striated muscle' }, { label: 'Lower third', value: 'Smooth muscle' }, { label: 'LOS pressure', value: '15–30 mmHg' }],
    },
    function: 'Propels food bolus by coordinated peristalsis (primary: swallow-initiated; secondary: distension-initiated). Lower oesophageal sphincter (LOS) prevents gastric reflux — maintained by intra-abdominal position, mucosal rosette, and phrenico-oesophageal ligament.',
    clinical: { conditions: ['GERD', 'Barrett\'s Oesophagus', 'Oesophageal Carcinoma', 'Achalasia', 'Oesophageal Varices'], note: 'Barrett\'s oesophagus: intestinal metaplasia (columnar → goblet cells) in lower oesophagus. Precursor to adenocarcinoma. Prague C&M criteria for extent. Surveillance endoscopy every 3–5 years. Achalasia: absent peristalsis + failure of LOS relaxation. HREM gold standard. Treatment: Heller myotomy or pneumatic dilation.' },
    related: ['UBERON_0000945', 'UBERON_0003126'],
  },

  UBERON_0000029: {
    id: 'UBERON_0000029', name: 'Lymph Node', view: 'body',
    overview: {
      description: 'Bean-shaped secondary lymphoid organs averaging 0.5–2 cm. The body contains 500–700 nodes. Organised into cortex (B-cells), paracortex (T-cells), and medulla (macrophages, plasma cells).',
      stats: [{ label: 'Count', value: '500–700 nodes' }, { label: 'Cortex', value: 'B-cell rich' }, { label: 'Paracortex', value: 'T-cell rich' }, { label: 'Afferent vessels', value: 'Multiple' }],
    },
    function: 'Filters lymph draining from tissues, removing antigens, pathogens, and tumour cells. Dendritic cells present antigens to T-cells in the paracortex → clonal expansion. B-cells in germinal centres undergo somatic hypermutation and class switching → plasma cells secreting high-affinity antibodies.',
    clinical: { conditions: ['Lymphadenopathy', 'Lymphoma (Hodgkin/NHL)', 'Metastatic Carcinoma', 'Reactive Lymphadenitis', 'Sarcoidosis'], note: 'Reed-Sternberg cells (owl-eye nuclei, CD15+/CD30+) are pathognomonic of Hodgkin lymphoma. Virus-infected lymphadenopathy: EBV → posterior cervical; CMV → generalised. Sentinel lymph node biopsy in breast cancer: first node draining tumour bed. If positive → axillary clearance.' },
    related: ['UBERON_0002106', 'UBERON_0002371', 'UBERON_0002372'],
  },

  UBERON_0002371: {
    id: 'UBERON_0002371', name: 'Bone Marrow', view: 'body',
    overview: {
      description: 'The primary site of haematopoiesis in adults, residing in cancellous bone of the vertebrae, ribs, sternum, pelvis, and proximal long bones. Red marrow (active) gradually replaced by yellow marrow (fat) with age.',
      stats: [{ label: 'Daily RBC prod.', value: '~200 billion' }, { label: 'Daily platelet prod.', value: '~150 billion' }, { label: 'Stem cell niche', value: 'Endosteal/perivascular' }, { label: 'G-CSF use', value: 'Neutrophil mob.' }],
    },
    function: 'Haematopoietic stem cells (HSC: CD34+/Lin−) give rise to all blood lineages via common myeloid and common lymphoid progenitors. Stromal cells (osteoblasts, CXCL12+ reticular cells) form the niche. EPO drives erythropoiesis; G-CSF drives granulopoiesis; TPO drives thrombopoiesis.',
    clinical: { conditions: ['Leukaemia', 'Aplastic Anaemia', 'Myelodysplastic Syndrome', 'Multiple Myeloma', 'Myelofibrosis'], note: 'Bone marrow biopsy: trephine from posterior iliac crest. Blast count ≥ 20% = AML/ALL. Hypocellular marrow + pancytopenia + no splenomegaly → aplastic anaemia. Myeloma: CRAB criteria (hyperCalcaemia, Renal failure, Anaemia, Bone lesions). Serum protein electrophoresis (M-band).' },
    related: ['UBERON_0002106', 'UBERON_0000029'],
  },

  UBERON_0002367: {
    id: 'UBERON_0002367', name: 'Prostate Gland', view: 'body',
    overview: {
      description: 'A walnut-sized exocrine gland (20–30 g) encircling the urethra below the bladder. Zones: peripheral (70% volume, cancer site), central (25%), transition (BPH site), and anterior fibromuscular stroma.',
      stats: [{ label: 'Weight', value: '20–30 g' }, { label: 'PSA normal', value: '< 4 ng/mL' }, { label: 'Zones', value: '4' }, { label: 'Cancer site', value: 'Peripheral zone' }],
    },
    function: 'Produces prostatic fluid (30% of semen volume): citric acid, zinc, PSA (liquefies semen), prostatic acid phosphatase. Zinc inhibits 5α-reductase, limiting local DHT. Innervation: sympathetic → ejaculation (internal sphincter closure); parasympathetic → secretion.',
    clinical: { conditions: ['Benign Prostatic Hyperplasia (BPH)', 'Prostate Carcinoma', 'Prostatitis', 'PSA elevation'], note: 'Prostate cancer: most common cancer in men. PSA > 10 ng/mL: biopsy strongly indicated; 4–10: use PSA density/velocity. Gleason score (1–5 + 1–5 = 2–10) grades differentiation. TRUS-guided biopsy: 12 cores. Localised disease: prostatectomy vs. radiotherapy ± brachytherapy. Hormonal: LHRH agonist + anti-androgen.' },
    related: ['UBERON_0001255', 'UBERON_0000473'],
  },

  UBERON_0000473: {
    id: 'UBERON_0000473', name: 'Testis', view: 'body',
    overview: {
      description: 'Paired oval glands in the scrotum, each ~4.5 × 2.5 cm and 15–30 mL volume. Maintained ~2°C below core body temperature (essential for spermatogenesis).',
      stats: [{ label: 'Volume', value: '15–30 mL' }, { label: 'Temperature', value: '2°C below core' }, { label: 'Sperm output', value: '~300 million/day' }, { label: 'Testosterone', value: '95% from Leydig' }],
    },
    function: 'Dual function: spermatogenesis (in seminiferous tubules, requires FSH + testosterone) and steroidogenesis (Leydig cells produce testosterone under LH stimulation). Sertoli cells (FSH-responsive) support germ cells via blood-testis barrier, secrete inhibin B (negative feedback on FSH).',
    clinical: { conditions: ['Testicular Cancer', 'Orchitis', 'Varicocele', 'Undescended Testis', 'Torsion'], note: 'Testicular cancer: most common solid tumour in males 15–35. 95% germ cell tumours (seminoma vs. NSGCT). AFP elevated in NSGCT; β-hCG in both. Self-examination key. Seminoma: radiosensitive, excellent prognosis. Retroperitoneal lymph node dissection for NSGCT. Torsion: surgical emergency — "twist and turn within 6 hours."' },
    related: ['UBERON_0002367', 'UBERON_0001301'],
  },

  /* ══════════════ BRAIN REGIONS ══════════════ */

  UBERON_0000956: {
    id: 'UBERON_0000956', name: 'Cerebral Cortex', view: 'brain',
    overview: {
      description: 'The outermost layer of the cerebrum, 2–4 mm thick, folded into gyri and sulci to increase surface area (~2,500 cm²). Contains ~16 billion neurons arranged in 6 layers. Site of higher cognitive functions.',
      stats: [{ label: 'Neurons', value: '~16 billion' }, { label: 'Thickness', value: '2–4 mm' }, { label: 'Surface area', value: '~2,500 cm²' }, { label: 'Layers', value: '6 (I–VI)' }],
    },
    function: 'Organised into functional areas by Brodmann mapping: primary motor cortex (area 4, precentral gyrus) → contralateral voluntary movement; primary somatosensory (areas 3,1,2, postcentral gyrus) → touch/proprioception; primary visual (area 17, occipital); primary auditory (areas 41,42, superior temporal). Association areas integrate information for perception, language, and executive function.',
    clinical: { conditions: ['Stroke', 'Epilepsy', 'Alzheimer\'s Disease', 'Tumour (Glioblastoma)', 'Traumatic Brain Injury'], note: 'FAST criteria for stroke: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Thrombolysis with IV alteplase within 4.5 hours of onset (ischaemic stroke confirmed on CT). "Time is neurons": 1.9 million neurons lost per minute of MCAO. MCA stroke: contralateral hemiplegia/anaesthesia, aphasia (dominant hemisphere).' },
    related: ['UBERON_0001870', 'UBERON_0000451', 'UBERON_0001871', 'UBERON_0001872'],
  },

  UBERON_0002421: {
    id: 'UBERON_0002421', name: 'Hippocampus', view: 'brain',
    overview: {
      description: 'A seahorse-shaped structure in the medial temporal lobe forming part of the limbic system. Critical for declarative (explicit) memory consolidation. First structure damaged in Alzheimer\'s disease.',
      stats: [{ label: 'Volume', value: '~3–3.5 cm³' }, { label: 'Pyramidal neurons', value: 'Dense, CA1–CA4' }, { label: 'Plasticity', value: 'LTP: NMDA receptor' }, { label: 'AD shrinkage', value: '~10%/year' }],
    },
    function: 'Coordinates episodic memory encoding (hippocampal-entorhinal circuit) and spatial navigation (place cells and grid cells). Long-term potentiation (LTP) via NMDA receptor activation is the synaptic correlate of learning. New neurons generated in the dentate gyrus (neurogenesis) throughout adulthood — exercise and BDNF enhance this.',
    clinical: { conditions: ['Alzheimer\'s Disease', 'Temporal Lobe Epilepsy', 'Anterograde Amnesia', 'PTSD (volume reduction)', 'Limbic Encephalitis'], note: 'H.M. (Henry Molaison): bilateral hippocampectomy for epilepsy → permanent anterograde amnesia. Preserved procedural memory (cerebellum intact). Limbic encephalitis: anti-NMDAR or anti-LGI1 antibodies. First-line: IV steroids + IVIG. TLE: most common focal epilepsy; 80% have hippocampal sclerosis.' },
    related: ['UBERON_0001876', 'UBERON_0001897', 'UBERON_0001898', 'UBERON_0000956'],
  },

  UBERON_0001876: {
    id: 'UBERON_0001876', name: 'Amygdala', view: 'brain',
    overview: {
      description: 'An almond-shaped nuclei complex at the anterior tip of the hippocampus in the medial temporal lobe. Key structure in emotional processing — particularly fear, anxiety and reward.',
      stats: [{ label: 'Location', value: 'Medial temporal lobe' }, { label: 'Key nuclei', value: 'Basolateral, centromedial' }, { label: 'Afferents', value: 'All sensory modalities' }, { label: 'Efferents', value: 'Hypothalamus, brainstem' }],
    },
    function: 'Processes emotional significance of sensory stimuli. The basolateral nucleus is the gateway for sensory input; the central nucleus coordinates autonomic and neuroendocrine fear responses via hypothalamic (CRH → cortisol) and PAG projections (freeze/flight/fight). Fear memory storage involves LTP of amygdala synapses. Critical for social cognition and face recognition.',
    clinical: { conditions: ['PTSD', 'Anxiety Disorders', 'Urbach-Wiethe Disease (bilateral calcification)', 'Autism Spectrum Disorder', 'Depression'], note: 'Bilateral amygdala lesions (Urbach-Wiethe disease): loss of fear response — patients approach dangerous situations without aversion. PTSD: hyperactive amygdala + reduced hippocampal volume. EMDR and trauma-focused CBT are first-line evidence-based treatments. DBS of basolateral amygdala is investigational for refractory PTSD.' },
    related: ['UBERON_0002421', 'UBERON_0001897', 'UBERON_0000956'],
  },

  UBERON_0001897: {
    id: 'UBERON_0001897', name: 'Thalamus', view: 'brain',
    overview: {
      description: 'A paired egg-shaped structure forming the dorsal diencephalon. Almost all sensory information (except olfaction) relays through the thalamus before reaching the cortex.',
      stats: [{ label: 'Nuclei', value: '> 50 distinct' }, { label: 'Position', value: 'Dorsal diencephalon' }, { label: 'Relay', value: 'All senses except smell' }, { label: 'Blood supply', value: 'Posterior circulation' }],
    },
    function: 'Major relay station and integrative hub. VPL nucleus → somatosensory relay; VPM → face; LGN (lateral geniculate nucleus) → visual; MGN → auditory; VL → motor (cerebellar projections to motor cortex); pulvinar → visual association; intralaminar nuclei → arousal/consciousness. Thalamo-cortical oscillations generate sleep spindles and EEG rhythms.',
    clinical: { conditions: ['Thalamic Stroke', 'Fatal Familial Insomnia', 'Thalamic Pain Syndrome', 'Essential Tremor (VIM DBS)', 'Wernicke\'s Encephalopathy'], note: 'Thalamic stroke (posterior circulation): crossed sensory loss, "pure sensory stroke." Dejerine-Roussy syndrome: contralateral pain hypersensitivity post-thalamic infarct. Fatal familial insomnia: prion disease, mutation at codon 178 of PRNP, selective thalamic degeneration. VIM (ventral intermediate nucleus) DBS for essential tremor.' },
    related: ['UBERON_0001898', 'UBERON_0001894', 'UBERON_0000956'],
  },

  UBERON_0001898: {
    id: 'UBERON_0001898', name: 'Hypothalamus', view: 'brain',
    overview: {
      description: 'A small (~4 g) but critical structure forming the floor of the third ventricle. Master regulator of the autonomic nervous system and neuroendocrine function via the pituitary gland.',
      stats: [{ label: 'Weight', value: '~4 g' }, { label: 'Nuclei', value: '~15 major' }, { label: 'Controls', value: 'Pituitary, ANS' }, { label: 'Circadian', value: 'SCN nucleus' }],
    },
    function: '4 Fs mnemonic: Feeding (lateral → hunger; ventromedial → satiety); Fighting (defensive aggression); Fleeing (autonomic stress); Fornicating (reproduction). Magnocellular nuclei (PVN, SON) produce ADH and oxytocin → neurohypophysis. Parvocellular nuclei release releasing hormones (TRH, CRH, GnRH, GHRH, somatostatin) → anterior pituitary. Suprachiasmatic nucleus (SCN) → circadian rhythms.',
    clinical: { conditions: ['Diabetes Insipidus', 'SIADH', 'Cushing\'s Disease (CRH excess)', 'Craniopharyngioma', 'Hypothalamic Obesity'], note: 'Central diabetes insipidus: ADH deficiency → polyuria (> 3 L/day), dilute urine (osmolality < 300 mOsm/kg), high serum sodium. Water deprivation test + desmopressin response. Craniopharyngioma: most common suprasellar tumour in children. Arises from Rathke\'s pouch remnants. Bitemporal hemianopia is the classic visual field defect.' },
    related: ['UBERON_0000007', 'UBERON_0001897', 'UBERON_0001876'],
  },

  UBERON_0002037: {
    id: 'UBERON_0002037', name: 'Cerebellum', view: 'brain',
    overview: {
      description: 'The "little brain" occupies the posterior fossa, comprising 10% of brain volume but containing > 50% of all neurons (mainly granule cells). Three functional zones: vermis (gait/balance), intermediate zone, lateral hemispheres (fine motor/skilled movement).',
      stats: [{ label: 'Neurons', value: '50% of brain total' }, { label: 'Purkinje cells', value: 'Only output neurons' }, { label: 'Folia', value: '> 1,000' }, { label: 'Volume', value: '~130 cm³' }],
    },
    function: 'Compares intended vs. actual movement (comparator model). Receives: (1) motor commands from cortex (corticopontocerebellar), (2) proprioception from spinal cord (spinocerebellar), (3) vestibular input. Output through deep cerebellar nuclei (dentate, emboliform, globose, fastigial) → thalamus → motor cortex. Responsible for timing, coordination, and motor learning (modification of reflexes).',
    clinical: { conditions: ['Cerebellar Ataxia', 'Medulloblastoma', 'Paraneoplastic Cerebellar Degeneration', 'Multiple Sclerosis', 'Alcohol-related Cerebellar Degeneration'], note: 'DANISH mnemonic for cerebellar signs: Dysdiadochokinesis, Ataxia (gait), Nystagmus, Intention tremor/IP,  Slurred speech (dysarthria), Hypotonia/Heel-shin test. Medulloblastoma: most common posterior fossa tumour in children. Midline vermis location → truncal ataxia + hydrocephalus. Anti-Yo antibodies in paraneoplastic syndrome (ovarian/breast cancer).' },
    related: ['UBERON_0002245', 'UBERON_0001896', 'UBERON_0000988'],
  },

  UBERON_0001896: {
    id: 'UBERON_0001896', name: 'Medulla Oblongata', view: 'brain',
    overview: {
      description: 'The lowermost portion of the brainstem, continuous with the spinal cord at the foramen magnum. Contains vital autonomic centres controlling breathing, heart rate, and blood pressure.',
      stats: [{ label: 'Length', value: '~3 cm' }, { label: 'Junction', value: 'C1 vertebra level' }, { label: 'CN origin', value: 'IX, X, XI, XII' }, { label: 'Centres', value: 'Respiratory, cardiovascular' }],
    },
    function: 'Houses the pre-Bötzinger complex (respiratory rhythm generation), cardiac centre (rate/force control via CN X), and vasomotor centre (vascular tone). Dorsal medulla: nucleus tractus solitarius (visceral sensory relay), dorsal vagal nucleus. Ventral medulla: corticospinal and corticobulbar tracts decussate in the pyramids. Inferior olive: learning-related error signals to cerebellum.',
    clinical: { conditions: ['Lateral Medullary Syndrome (Wallenberg)', 'Medullary Hemorrhage', 'Arnold-Chiari Malformation', 'Multiple System Atrophy', 'Locked-in Syndrome (if basilar)'], note: 'Wallenberg (lateral medullary) syndrome: PICA infarct. Ipsilateral: facial pain/temperature loss, Horner\'s, ataxia, hoarseness, dysphagia. Contralateral: body pain/temperature loss. Preserved motor power. Lateral medullary syndrome follows the 5 Ds: Dysphagia, Dysarthria, Dizziness, Diplopia, Drop attacks.' },
    related: ['UBERON_0001894', 'UBERON_0002037', 'UBERON_0002240'],
  },

  UBERON_0000007: {
    id: 'UBERON_0000007', name: 'Pituitary Gland', view: 'brain',
    overview: {
      description: 'The "master gland" — a pea-sized structure (0.5–1 g) in the sella turcica. Composed of anterior (adenohypophysis, 75%) and posterior (neurohypophysis, 25%) lobes with distinct embryological origins.',
      stats: [{ label: 'Weight', value: '0.5–1 g' }, { label: 'Location', value: 'Sella turcica (sphenoid)' }, { label: 'Anterior hormones', value: '6' }, { label: 'Posterior hormones', value: '2' }],
    },
    function: 'Anterior lobe (Rathke\'s pouch origin): GH (somatotrophs), TSH (thyrotrophs), ACTH (corticotrophs), FSH/LH (gonadotrophs), Prolactin (lactotrophs). Regulated by hypothalamic releasing/inhibiting hormones. Posterior lobe (neural tissue): stores and releases ADH (from PVN) and oxytocin (from SON). ADH → V2 receptors → aquaporin-2 insertion in renal collecting duct.',
    clinical: { conditions: ['Pituitary Adenoma', 'Hypopituitarism', 'Acromegaly', 'Cushing\'s Disease', 'Prolactinoma'], note: 'Prolactinoma: most common pituitary tumour. Causes galactorrhoea + amenorrhoea in women, erectile dysfunction in men. First line: dopamine agonist (cabergoline/bromocriptine). Acromegaly: GH excess after epiphyseal fusion → coarse features, organomegaly, DM, hypertension. Classic test: failure to suppress GH with 75 g oral glucose.' },
    related: ['UBERON_0001898', 'UBERON_0002046', 'UBERON_0002369'],
  },

  UBERON_0002038: {
    id: 'UBERON_0002038', name: 'Substantia Nigra', view: 'brain',
    overview: {
      description: 'A pigmented midbrain nucleus (black due to neuromelanin in dopaminergic neurons) comprising pars compacta (dopamine-producing) and pars reticulata (GABA-inhibitory output).',
      stats: [{ label: 'Location', value: 'Dorsal midbrain' }, { label: 'Pigment', value: 'Neuromelanin' }, { label: 'Neurotransmitter', value: 'Dopamine (SNc)' }, { label: 'PD loss', value: '> 80% neurons' }],
    },
    function: 'Pars compacta → dopaminergic nigrostriatal pathway → caudate + putamen → regulates voluntary movement initiation and procedural learning. Normally inhibits indirect pathway (STN → GPi activity), facilitating desired movements. Pars reticulata: GABAergic output to thalamus, superior colliculus (eye movements), brainstem.',
    clinical: { conditions: ['Parkinson\'s Disease', 'Progressive Supranuclear Palsy', 'MPTP Toxicity', 'Multiple System Atrophy', 'Drug-induced Parkinsonism'], note: 'Parkinson\'s: TRAP — Tremor (pill-rolling, resting), Rigidity (cogwheel), Akinesia/bradykinesia, Postural instability. Pathology: Lewy bodies (α-synuclein aggregates) in remaining SN neurons. Dopamine PET/DAT scan confirms. Levodopa+carbidopa is first-line. DBS of STN for advanced disease.' },
    related: ['UBERON_0001873', 'UBERON_0001874', 'UBERON_0001875'],
  },

  UBERON_0001873: {
    id: 'UBERON_0001873', name: 'Caudate Nucleus', view: 'brain',
    overview: {
      description: 'A C-shaped grey matter structure forming part of the dorsal striatum along with the putamen. Its head abuts the lateral ventricle\'s frontal horn; its tail curves into the temporal lobe.',
      stats: [{ label: 'Part of', value: 'Dorsal striatum' }, { label: 'Input', value: 'Cortex, SN' }, { label: 'NT received', value: 'Dopamine, Glutamate' }, { label: 'HD atrophy', value: 'Progressive caudate loss' }],
    },
    function: 'Primary input nucleus of the basal ganglia. Receives topographic projections from the cerebral cortex (glutamatergic) and dopaminergic input from substantia nigra. Functions in goal-directed behaviour (associative loop with prefrontal cortex), cognitive flexibility, and procedural learning.',
    clinical: { conditions: ['Huntington\'s Disease', 'OCD (enlarged caudate)', 'ADHD', 'Tourette Syndrome', 'Schizophrenia'], note: 'Huntington\'s disease: autosomal dominant, CAG repeat expansion in HTT gene (> 36 = disease; > 60 = juvenile onset). Caudate atrophy produces the characteristic "butterfly" ventricles on MRI. Clinical triad: chorea + cognitive decline + psychiatric disturbance. No disease-modifying therapy currently; riluzole for chorea.' },
    related: ['UBERON_0001874', 'UBERON_0002038', 'UBERON_0001875'],
  },

  UBERON_0001874: {
    id: 'UBERON_0001874', name: 'Putamen', view: 'brain',
    overview: {
      description: 'The largest nucleus of the basal ganglia, forming the outer portion of the lenticular nucleus (with globus pallidus). Lies laterally within the temporal lobe, between the internal and external capsules.',
      stats: [{ label: 'Part of', value: 'Lenticular nucleus' }, { label: 'Receives', value: 'Motor cortex input' }, { label: 'Function', value: 'Motor regulation loop' }, { label: 'PD involvement', value: 'Dopaminergic loss' }],
    },
    function: 'Part of the sensorimotor loop of basal ganglia circuitry. Receives input from primary and supplementary motor cortices. Connects to globus pallidus (internal: GPi; external: GPe) through direct pathway (facilitatory, D1 receptor) and indirect pathway (inhibitory, D2 receptor). Balance between these pathways determines movement quality.',
    clinical: { conditions: ['Parkinson\'s Disease', 'Wilson\'s Disease', 'Hemiballismus (contralateral STN lesion)', 'Dystonia', 'Sydenham\'s Chorea'], note: 'Wilson\'s disease (hepatolenticular degeneration): ATP7B gene mutation → copper accumulation in liver, putamen, and cornea (Kayser-Fleischer rings). Presents: liver disease + neuropsychiatric symptoms (dysarthria, tremor, psychiatric). Serum ceruloplasmin low; 24-hr urine copper elevated. Treatment: chelation with D-penicillamine or trientine.' },
    related: ['UBERON_0001873', 'UBERON_0001875', 'UBERON_0002038'],
  },

  UBERON_0001875: {
    id: 'UBERON_0001875', name: 'Globus Pallidus', view: 'brain',
    overview: {
      description: 'The medial component of the lenticular nucleus, consisting of internal (GPi) and external (GPe) segments. Primary output nucleus of basal ganglia, with tonically active GABAergic neurons.',
      stats: [{ label: 'Segments', value: 'GPi (internal) + GPe' }, { label: 'NT', value: 'GABA (inhibitory)' }, { label: 'Firing rate', value: '50–100 Hz tonically' }, { label: 'DBS target', value: 'GPi for dystonia' }],
    },
    function: 'GPi is the primary output of basal ganglia → thalamus (ventral anterior/lateral nuclei) → motor cortex. GPi activity inhibits thalamus (reducing movement). Direct pathway (D1): Striatum → GPi inhibition → thalamus disinhibition → movement facilitation. Indirect pathway (D2): Striatum → GPe → STN → GPi activation → thalamus inhibition → movement suppression.',
    clinical: { conditions: ['Dystonia (GPi DBS target)', 'Parkinson\'s Disease', 'Pallidal Lesions (Wilsons)', 'Drug-induced Tardive Dyskinesia', 'Kernicterus (neonatal)'], note: 'GPi deep brain stimulation (DBS): first-line surgical treatment for primary generalised dystonia and medication-refractory cervical dystonia. Also used for PD (reduces motor fluctuations, dyskinesia). Kernicterus: bilirubin deposition in globus pallidus and subthalamic nucleus → choreoathetosis, hearing loss, oculomotor palsy.' },
    related: ['UBERON_0001874', 'UBERON_0001873', 'UBERON_0002038'],
  },

};

export const ALL_ORGAN_IDS = Object.keys(ORGAN_DATABASE);
