/**
 * Team-Created Learning Resources
 * Curated learning modules for 7-day career development plans.
 */

const RESOURCES = [
  {
    id: 'LR01',
    title: 'Python Data Cleaning Exercise',
    skills: ['Data cleaning'],
    type: 'Interactive Exercise',
    duration_minutes: 45,
    difficulty: 'Beginner',
    description: 'Practical exercise on handling missing values, trimming strings, and formatting dates using Python.',
    activity: 'Load a messy CSV dataset into Python, filter null records, standardize date columns, and export a cleaned dataset.'
  },
  {
    id: 'LR02',
    title: 'SQL Query Practice Lab',
    skills: ['SQL'],
    type: 'Hands-on Lab',
    duration_minutes: 45,
    difficulty: 'Beginner',
    description: 'Hands-on practice writing SELECT statements, JOINs, aggregations, and GROUP BY queries on relational tables.',
    activity: 'Execute 5 guided SQL queries against an eCommerce database schema to compute order totals and customer summaries.'
  },
  {
    id: 'LR03',
    title: 'Data Visualization Mini-Lesson',
    skills: ['Data visualization'],
    type: 'Tutorial & Guided Practice',
    duration_minutes: 45,
    difficulty: 'Beginner',
    description: 'Core principles of effective data visualization, chart type selection, and visual storytelling.',
    activity: 'Design a bar chart and time-series line plot from summarized metrics, applying proper labels and color contrast.'
  },
  {
    id: 'LR04',
    title: 'Build a Simple Data Dashboard',
    skills: ['Dashboard development'],
    type: 'Project Lab',
    duration_minutes: 90,
    difficulty: 'Intermediate',
    description: 'Step-by-step project assembling interactive KPI cards and visual filters into a cohesive data dashboard.',
    activity: 'Construct an interactive multi-chart dashboard presenting key performance indicators and a dynamic date filter.'
  },
  {
    id: 'LR05',
    title: 'Software Testing Practice Lab',
    skills: ['Testing fundamentals'],
    type: 'Hands-on Lab',
    duration_minutes: 60,
    difficulty: 'Beginner',
    description: 'Foundations of software quality assurance, boundary value testing, and writing repeatable unit assertions.',
    activity: 'Write 4 automated unit test cases covering happy path, invalid inputs, and edge boundary conditions for a utility module.'
  }
];

module.exports = {
  RESOURCES
};

