/**
 * Demonstration Internship Opportunities
 * Fictitious records for university career advising demonstration.
 */

const OPPORTUNITIES = [
  {
    id: 'OPP001',
    title: 'Junior Data Analyst Intern',
    type: 'Internship (Demonstration Record)',
    description: 'Assist the analytics team with extracting, cleaning, and reporting student engagement data.',
    requiredSkills: ['Python', 'SQL', 'Excel'],
    preferredSkills: ['Data visualization'],
    responsibilities: [
      'Write SQL queries to aggregate transactional data',
      'Perform preliminary data cleaning and transformation in Python',
      'Create formatted Excel spreadsheets and visual summaries for stakeholders'
    ]
  },
  {
    id: 'OPP002',
    title: 'Junior Web Developer Intern',
    type: 'Internship (Demonstration Record)',
    description: 'Build and maintain responsive user interface components for university web portals.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript'],
    preferredSkills: ['Git'],
    responsibilities: [
      'Develop modern semantic HTML5 and CSS3 user interfaces',
      'Implement interactive client-side logic using vanilla JavaScript',
      'Collaborate with developers using Git version control and pull requests'
    ]
  },
  {
    id: 'OPP003',
    title: 'Python Development Trainee',
    type: 'Internship (Demonstration Record)',
    description: 'Work alongside backend engineers to develop and integrate lightweight REST microservices.',
    requiredSkills: ['Python', 'Git', 'API basics'],
    preferredSkills: ['Testing fundamentals'],
    responsibilities: [
      'Write clean, modular backend application code in Python',
      'Integrate third-party REST APIs and handle HTTP status codes',
      'Maintain code repositories and feature branches using Git'
    ]
  },
  {
    id: 'OPP004',
    title: 'Software Testing Intern',
    type: 'Internship (Demonstration Record)',
    description: 'Validate web applications through automated test scripts and structured exploratory testing.',
    requiredSkills: ['Testing fundamentals', 'Python'],
    preferredSkills: ['Git'],
    responsibilities: [
      'Write automated unit and integration tests using Python test frameworks',
      'Document defects, reproducible test cases, and quality metrics',
      'Track bug fixes and collaborate via Git version control'
    ]
  },
  {
    id: 'OPP005',
    title: 'IT Support Intern',
    type: 'Internship (Demonstration Record)',
    description: 'Support university campus computing infrastructure, workstation troubleshooting, and user inquiries.',
    requiredSkills: ['Troubleshooting', 'Networking basics'],
    preferredSkills: ['Communication'],
    responsibilities: [
      'Diagnose hardware, operating system, and application connectivity issues',
      'Verify local area network (LAN), DNS, and IP address configurations',
      'Communicate technical troubleshooting steps clearly to non-technical users'
    ]
  }
];

module.exports = {
  OPPORTUNITIES
};

