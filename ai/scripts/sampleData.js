/**
 * Sample mock data for testing CareerPath AI modules.
 * Note: Never imported by src/.
 */

export const cvText = `Amina Bekele
Final-year Business Analytics student at City University
Email: amina.bekele@example.edu | Portfolio: github.com/aminabekele

SUMMARY
Analytical and detail-oriented student with a strong background in data cleaning, predictive modeling, and executive dashboard design. Passionate about turning raw data into strategic business insights.

SKILLS
- Programming & Analysis: Python, Statistical analysis, Machine learning
- Reporting & Tools: Data visualization, Excel, Git
- Soft Skills: Business communication

PROJECTS & EXPERIENCE
- Student Analytics Consultant (2025):
  "Built automated data cleaning scripts using Python" to process survey responses for 500+ participants.
  "Designed interactive dashboards for weekly sales reviews" enabling stakeholders to spot variance quickly.
  "Conducted statistical analysis on student feedback" to identify retention bottlenecks.
  "Delivered business communication presentations to department heads" summarizing core findings.

- Operations Intern at Nile Retail (Summer 2024):
  "Created automated Excel workbooks with advanced macros" to forecast seasonal product demand.
  "pulled order records from the company database" and formatted discrepancy summaries for the logistics director.
  "Applied machine learning regression models" to estimate inventory safety stock.

EDUCATION
B.S. in Business Analytics, Expected May 2026.
`;

export const skillVocabulary = [
  'Python',
  'Data visualization',
  'Excel',
  'Statistical analysis',
  'Machine learning',
  'Business communication',
  'SQL',
  'Figma',
  'Tableau',
  'Git',
];

export const opportunities = [
  {
    id: 'OPP-01',
    title: 'Junior Business Intelligence Analyst',
    description: 'Deliver clear dashboards that inform team decisions and experience with customer data. Work with cross-functional teams to translate metrics into strategic reports. Daily use of SQL for querying warehouses.',
    required: ['Data visualization', 'SQL'],
    preferred: ['Python', 'Figma'],
  },
  {
    id: 'OPP-02',
    title: 'Junior Data Analyst',
    description: 'Built automated data cleaning scripts and run recurring queries. Collaborate with marketing to measure campaign performance and present findings to leadership.',
    required: ['Python', 'SQL'],
    preferred: ['Excel', 'Statistical analysis'],
  },
  {
    id: 'OPP-03',
    title: 'Associate Product Growth Analyst',
    description: 'Designed interactive dashboards for weekly sales reviews and user conversion tracking. Design prototype UI concepts and analyze customer churn datasets.',
    required: ['Data visualization', 'Figma'],
    preferred: ['Machine learning', 'Python'],
  },
  {
    id: 'OPP-04',
    title: 'Marketing Insights Associate',
    description: 'Analyze multi-channel conversion data and build predictive models for customer lifetime value. Strong written and verbal communication required.',
    required: ['Statistical analysis', 'Business communication'],
    preferred: ['SQL', 'Excel'],
  },
  {
    id: 'OPP-05',
    title: 'Operations Analytics Specialist',
    description: 'Optimize supply chain workflows using data analysis. Strong spreadsheet modeling and database extraction skills required.',
    required: ['Excel', 'SQL'],
    preferred: ['Python', 'Git'],
  },
];

export const resources = [
  {
    id: 'R-01',
    title: 'Practical SQL for Data Analysts: Queries & Joins',
    type: 'course',
    minutes: 40,
    skills: ['SQL'],
  },
  {
    id: 'R-02',
    title: 'Intermediate SQL: Window Functions & Performance',
    type: 'tutorial',
    minutes: 35,
    skills: ['SQL'],
  },
  {
    id: 'R-03',
    title: 'Executive Data Storytelling and Visualization',
    type: 'project',
    minutes: 45,
    skills: ['Data visualization'],
  },
  {
    id: 'R-04',
    title: 'Python for Automated Data Wrangling',
    type: 'course',
    minutes: 50,
    skills: ['Python'],
  },
  {
    id: 'R-05',
    title: 'Advanced Financial Modeling with Excel',
    type: 'tutorial',
    minutes: 30,
    skills: ['Excel'],
  },
];

export const profile = {
  skills: [
    {
      name: 'Python',
      level: 'working',
      evidence: 'Built automated data cleaning scripts using Python',
      weak_evidence: false,
    },
    {
      name: 'Data visualization',
      level: 'working',
      evidence: 'Designed interactive dashboards for weekly sales reviews',
      weak_evidence: false,
    },
    {
      name: 'Statistical analysis',
      level: 'working',
      evidence: 'Conducted statistical analysis on student feedback',
      weak_evidence: false,
    },
    {
      name: 'Business communication',
      level: 'strong',
      evidence: 'Delivered business communication presentations to department heads',
      weak_evidence: false,
    },
    {
      name: 'Excel',
      level: 'strong',
      evidence: 'Created automated Excel workbooks with advanced macros',
      weak_evidence: false,
    },
    {
      name: 'Machine learning',
      level: 'beginner',
      evidence: 'Applied machine learning regression models',
      weak_evidence: false,
    },
    {
      name: 'SQL',
      level: 'beginner',
      evidence: 'pulled order records from the company database',
      weak_evidence: true,
    },
  ],
};

export const ranked = [
  {
    id: 'OPP-01',
    title: 'Junior Business Intelligence Analyst',
    score: 82,
    matched: ['Data visualization', 'Python'],
    missing: ['SQL', 'Figma'],
  },
  {
    id: 'OPP-02',
    title: 'Junior Data Analyst',
    score: 78,
    matched: ['Python', 'Excel', 'Statistical analysis'],
    missing: ['SQL'],
  },
  {
    id: 'OPP-03',
    title: 'Associate Product Growth Analyst',
    score: 71,
    matched: ['Data visualization', 'Python', 'Machine learning'],
    missing: ['Figma'],
  },
];
