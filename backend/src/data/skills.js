/**
 * Canonical Skills & Alias Dictionary
 * AI Career Development Agent
 */

const CANONICAL_SKILLS = [
  'Python',
  'SQL',
  'Excel',
  'HTML',
  'CSS',
  'JavaScript',
  'Git',
  'API basics',
  'Testing fundamentals',
  'Troubleshooting',
  'Networking basics',
  'Communication',
  'Data cleaning',
  'Data visualization',
  'Dashboard development'
];

// Lookup map for fast canonical matching (case-insensitive)
const CANONICAL_SET = new Map(
  CANONICAL_SKILLS.map((skill) => [skill.toLowerCase(), skill])
);

// Common aliases mapping to canonical skill names
const SKILL_ALIASES = {
  // JavaScript
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'ecmascript': 'JavaScript',
  'vanilla js': 'JavaScript',
  'vanillajs': 'JavaScript',

  // Python
  'python': 'Python',
  'py': 'Python',
  'python3': 'Python',

  // SQL
  'sql': 'SQL',
  'postgres': 'SQL',
  'postgresql': 'SQL',
  'mysql': 'SQL',
  'sqlite': 'SQL',
  'rdbms': 'SQL',

  // Excel
  'excel': 'Excel',
  'ms excel': 'Excel',
  'microsoft excel': 'Excel',
  'spreadsheet': 'Excel',
  'spreadsheets': 'Excel',
  'google sheets': 'Excel',

  // HTML
  'html': 'HTML',
  'html5': 'HTML',

  // CSS
  'css': 'CSS',
  'css3': 'CSS',

  // Git
  'git': 'Git',
  'github': 'Git',
  'gitlab': 'Git',
  'version control': 'Git',

  // API basics
  'api': 'API basics',
  'apis': 'API basics',
  'api basics': 'API basics',
  'rest': 'API basics',
  'rest api': 'API basics',
  'rest apis': 'API basics',
  'restful api': 'API basics',
  'restful apis': 'API basics',
  'web apis': 'API basics',

  // Testing fundamentals
  'testing': 'Testing fundamentals',
  'software testing': 'Testing fundamentals',
  'testing fundamentals': 'Testing fundamentals',
  'qa': 'Testing fundamentals',
  'qa testing': 'Testing fundamentals',
  'unit testing': 'Testing fundamentals',
  'automated testing': 'Testing fundamentals',

  // Troubleshooting
  'troubleshooting': 'Troubleshooting',
  'debugging': 'Troubleshooting',
  'issue resolution': 'Troubleshooting',
  'problem diagnosis': 'Troubleshooting',

  // Networking basics
  'networking': 'Networking basics',
  'networking basics': 'Networking basics',
  'computer networks': 'Networking basics',
  'tcp/ip': 'Networking basics',
  'network fundamentals': 'Networking basics',

  // Communication
  'communication': 'Communication',
  'written communication': 'Communication',
  'verbal communication': 'Communication',
  'team communication': 'Communication',

  // Data cleaning
  'data cleaning': 'Data cleaning',
  'data cleansing': 'Data cleaning',
  'data wrangling': 'Data cleaning',
  'data preprocessing': 'Data cleaning',

  // Data visualization
  'data visualization': 'Data visualization',
  'dataviz': 'Data visualization',
  'data viz': 'Data visualization',
  'charts': 'Data visualization',
  'graphing': 'Data visualization',

  // Dashboard development
  'dashboard': 'Dashboard development',
  'dashboards': 'Dashboard development',
  'dashboard development': 'Dashboard development',
  'tableau': 'Dashboard development',
  'power bi': 'Dashboard development',
  'bi dashboard': 'Dashboard development'
};

/**
 * Normalizes an arbitrary skill name to its canonical form.
 * Trims whitespace, normalizes internal spaces, and checks both canonical names and aliases.
 *
 * @param {string} name Raw skill name (e.g. 'js', 'GITHUB', '  python ')
 * @returns {string|null} Canonical skill name, or null if unrecognized
 */
function normalize(name) {
  if (!name || typeof name !== 'string') {
    return null;
  }

  const cleaned = name.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!cleaned) {
    return null;
  }

  // Check alias dictionary first
  if (SKILL_ALIASES[cleaned]) {
    return SKILL_ALIASES[cleaned];
  }

  // Check direct canonical match (case-insensitive)
  if (CANONICAL_SET.has(cleaned)) {
    return CANONICAL_SET.get(cleaned);
  }

  return null;
}

/**
 * Checks if a skill name is canonical.
 * @param {string} name
 * @returns {boolean}
 */
function isCanonical(name) {
  return CANONICAL_SKILLS.includes(name);
}

module.exports = {
  CANONICAL_SKILLS,
  SKILL_ALIASES,
  normalize,
  isCanonical
};

