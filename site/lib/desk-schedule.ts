// Single source of truth for every date in the /desk section.
// Read by: the dashboard (app/desk/page.tsx), the ICS feed (app/desk/calendar.ics/route.ts),
// and the one-time calendar push. Edit dates here only, nowhere else.

export interface DeskEvent {
  id: string
  title: string
  /** ISO 8601, local ET wall-clock time (no offset) */
  start: string
  end: string
  allDay?: boolean
  track: 'omscs' | 'lsat'
  note?: string
  /** true if this date is an estimate, not a confirmed date */
  tentative?: boolean
}

export interface StudyBlock {
  id: string
  title: string
  track: 'omscs' | 'lsat'
  /** 0 = Sunday ... 6 = Saturday */
  dayOfWeek: number
  startTime: string // "HH:MM" 24h ET
  endTime: string
  /** ISO date, first occurrence */
  from: string
  /** ISO date, last occurrence (inclusive) */
  until: string
}

export interface UnitMeta {
  unit: number
  slug: string
  title: string
  dueAssignment: string
  dueDate: string | null
  topics: string[]
  estMinutes: number
  firstStep: string
}

// ---- ISYE 6420 deadlines, from the Fall 2026 syllabus ----
export const OMSCS_EVENTS: DeskEvent[] = [
  { id: 'hw2', title: 'ISYE 6420, Homework 2 due', start: '2026-09-13T23:59:00', end: '2026-09-14T00:14:00', track: 'omscs', note: 'Units 4.1-4.9, 6% of grade' },
  { id: 'hw3', title: 'ISYE 6420, Homework 3 due', start: '2026-09-27T23:59:00', end: '2026-09-28T00:14:00', track: 'omscs', note: 'Rest of Unit 4, 6% of grade' },
  { id: 'hw4', title: 'ISYE 6420, Homework 4 due', start: '2026-10-11T23:59:00', end: '2026-10-12T00:14:00', track: 'omscs', note: 'Unit 5, 6% of grade' },
  { id: 'midterm', title: 'ISYE 6420, Midterm window', start: '2026-10-16T18:00:00', end: '2026-10-18T18:00:00', track: 'omscs', note: 'Units 1-5, 25% of grade, open-book 48hr window' },
  { id: 'hw5', title: 'ISYE 6420, Homework 5 due', start: '2026-11-08T23:59:00', end: '2026-11-09T00:14:00', track: 'omscs', note: 'Units 6-7, first PyMC assignment, 6% of grade' },
  { id: 'hw6', title: 'ISYE 6420, Homework 6 due', start: '2026-11-22T23:59:00', end: '2026-11-23T00:14:00', track: 'omscs', note: 'Units 8-9, 6% of grade' },
  { id: 'project', title: 'ISYE 6420, Project due', start: '2026-12-06T23:59:00', end: '2026-12-07T00:14:00', track: 'omscs', note: 'Individual Bayesian analysis, 10% of grade' },
  { id: 'final', title: 'ISYE 6420, Final exam window', start: '2026-12-11T18:00:00', end: '2026-12-13T18:00:00', track: 'omscs', note: 'Units 1-10, 35% of grade, open-book 48hr window' },
]

// LSAT target, month only, no exact date registered yet.
export const LSAT_TARGET: DeskEvent = {
  id: 'lsat-target',
  title: 'LSAT window (estimate, confirm exact date after registering)',
  start: '2027-06-01T00:00:00',
  end: '2027-06-02T00:00:00',
  allDay: true,
  track: 'lsat',
  tentative: true,
}

// Weekend deep-block rhythm: Saturday mornings for OMSCS (leaves Sunday clear before the
// 11:59pm Sunday HW deadlines), Sunday afternoons for LSAT. Light weekday touchpoint on
// Tuesdays for LSAT review only, no weekday OMSCS block by design.
//
// Each same-day pair leaves a real 1-2hr gap (not just a short breather), enough time to
// fully step away, eat, walk around, so the second block starts on a reset brain rather
// than as a tired continuation of the first.
export const STUDY_BLOCKS: StudyBlock[] = [
  {
    id: 'omscs-saturday-1',
    title: 'ISYE 6420 study block (1 of 2)',
    track: 'omscs',
    dayOfWeek: 6,
    startTime: '09:00',
    endTime: '10:00',
    from: '2026-08-22',
    until: '2026-12-17',
  },
  {
    id: 'omscs-saturday-2',
    title: 'ISYE 6420 study block (2 of 2)',
    track: 'omscs',
    dayOfWeek: 6,
    startTime: '11:00',
    endTime: '12:00',
    from: '2026-08-22',
    until: '2026-12-17',
  },
  {
    id: 'lsat-sunday-1',
    title: 'LSAT block (1 of 2)',
    track: 'lsat',
    dayOfWeek: 0,
    startTime: '14:00',
    endTime: '14:50',
    from: '2026-08-22',
    until: '2027-06-01',
  },
  {
    id: 'lsat-sunday-2',
    title: 'LSAT block (2 of 2)',
    track: 'lsat',
    dayOfWeek: 0,
    startTime: '16:00',
    endTime: '16:50',
    from: '2026-08-22',
    until: '2027-06-01',
  },
  {
    id: 'lsat-tuesday-light',
    title: 'LSAT light review (blind review / log a few questions)',
    track: 'lsat',
    dayOfWeek: 2,
    startTime: '19:00',
    endTime: '19:30',
    from: '2026-08-22',
    until: '2027-06-01',
  },
]

export interface OmscsSession {
  /** ISO date, the Saturday this session falls on */
  date: string
  /** which of the two Saturday blocks (times come from STUDY_BLOCKS) */
  block: 1 | 2
  unitSlug: string
  label: string
}

// Explicit unit-to-Saturday pacing, checked against the HW/midterm/final dates in
// OMSCS_EVENTS above. 2026-10-17 and 2026-12-12 are deliberately skipped, those Saturdays
// fall inside the midterm and final exam windows, so no new-content block is scheduled;
// use the time for the exam itself instead.
export const OMSCS_SESSIONS: OmscsSession[] = [
  { date: '2026-08-22', block: 1, unitSlug: 'unit-1', label: 'learn' },
  { date: '2026-08-22', block: 2, unitSlug: 'unit-1', label: 'practice' },
  { date: '2026-08-29', block: 1, unitSlug: 'unit-2', label: 'learn' },
  { date: '2026-08-29', block: 2, unitSlug: 'unit-2', label: 'practice' },
  { date: '2026-09-05', block: 1, unitSlug: 'unit-3', label: 'learn' },
  { date: '2026-09-05', block: 2, unitSlug: 'unit-3', label: 'practice' },
  { date: '2026-09-12', block: 1, unitSlug: 'unit-4', label: 'learn (pt. 1)' },
  { date: '2026-09-12', block: 2, unitSlug: 'unit-4', label: 'practice (pt. 1)' },
  { date: '2026-09-19', block: 1, unitSlug: 'unit-4', label: 'learn (pt. 2)' },
  { date: '2026-09-19', block: 2, unitSlug: 'unit-4', label: 'practice (pt. 2)' },
  { date: '2026-09-26', block: 1, unitSlug: 'unit-4', label: 'review before HW3' },
  { date: '2026-09-26', block: 2, unitSlug: 'unit-4', label: 'finish HW3' },
  { date: '2026-10-03', block: 1, unitSlug: 'unit-5', label: 'learn' },
  { date: '2026-10-03', block: 2, unitSlug: 'unit-5', label: 'practice' },
  { date: '2026-10-10', block: 1, unitSlug: 'unit-5', label: 'review before HW4' },
  { date: '2026-10-10', block: 2, unitSlug: 'unit-5', label: 'finish HW4' },
  { date: '2026-10-24', block: 1, unitSlug: 'unit-6', label: 'learn' },
  { date: '2026-10-24', block: 2, unitSlug: 'unit-6', label: 'practice' },
  { date: '2026-10-31', block: 1, unitSlug: 'unit-6', label: 'review & wrap' },
  { date: '2026-10-31', block: 2, unitSlug: 'unit-7', label: 'learn' },
  { date: '2026-11-07', block: 1, unitSlug: 'unit-7', label: 'practice' },
  { date: '2026-11-07', block: 2, unitSlug: 'unit-7', label: 'finish HW5' },
  { date: '2026-11-14', block: 1, unitSlug: 'unit-8', label: 'learn' },
  { date: '2026-11-14', block: 2, unitSlug: 'unit-8', label: 'practice' },
  { date: '2026-11-21', block: 1, unitSlug: 'unit-9', label: 'learn' },
  { date: '2026-11-21', block: 2, unitSlug: 'unit-9', label: 'finish HW6' },
  { date: '2026-11-28', block: 1, unitSlug: 'unit-10', label: 'learn' },
  { date: '2026-11-28', block: 2, unitSlug: 'unit-10', label: 'start project' },
  { date: '2026-12-05', block: 1, unitSlug: 'unit-10', label: 'finish project' },
  { date: '2026-12-05', block: 2, unitSlug: 'unit-10', label: 'final review buffer' },
]

export const OMSCS_UNITS: UnitMeta[] = [
  {
    unit: 1, slug: 'unit-1', title: 'Course orientation & a first regression',
    dueAssignment: 'Homework 1 (optional, 0%)', dueDate: null,
    topics: ['What "Bayesian" actually means as a philosophy of inference', 'Course tools and workflow', 'A simple regression worked the ordinary way, as a baseline'],
    estMinutes: 30,
    firstStep: 'Skim the course overview and work through the simple regression example by hand, no new theory yet, just get the tooling working. ~30 min.',
  },
  {
    unit: 2, slug: 'unit-2', title: 'Bayesian vs. frequentist, and why the distinction matters',
    dueAssignment: 'Homework 1 (optional, 0%)', dueDate: null,
    topics: ['Where Bayesian statistics came from historically', 'Probability as belief vs. probability as long-run frequency', 'The coin-flip example that makes the philosophical gap concrete', 'A real case (FDA guidance) where the two schools disagree in practice'],
    estMinutes: 40,
    firstStep: 'Read the coin-flip comparison and write, in your own words, one sentence on what a frequentist confidence interval promises that a Bayesian credible interval does not (and vice versa). ~15 min.',
  },
  {
    unit: 3, slug: 'unit-3', title: 'The probability toolkit: conditioning and Bayes\' theorem',
    dueAssignment: 'Homework 1 (optional, 0%)', dueDate: null,
    topics: ['Conditional probability, two ways of thinking about it', "Bayes' theorem derived from first principles", 'The classic manufacturing/defect-rate setup', 'The two-headed-coin problem', 'Bayes nets and the alarm example'],
    estMinutes: 45,
    firstStep: 'Work the two-headed-coin problem cold, by hand, before watching the solution. That single problem is the fastest way to feel why the denominator in Bayes\' theorem matters. ~20 min.',
  },
  {
    unit: 4, slug: 'unit-4', title: 'Conjugate priors and Bayesian inference in closed form',
    dueAssignment: 'Homework 2 (9/13) & Homework 3 (9/27)', dueDate: '2026-09-13',
    topics: ['Standard distributions and their moments', 'The ingredients of Bayes\' theorem: prior, likelihood, posterior, evidence', 'Conjugate families (Beta-Binomial, Gamma-Poisson, Normal-Normal) and why they matter', 'Point estimation, credible intervals, and hypothesis testing from a posterior', 'Choosing priors: elicitation, non-informative priors, and effective sample size', 'Empirical Bayes'],
    estMinutes: 60,
    firstStep: 'Derive the Beta-Binomial posterior update by hand for one toy dataset (a handful of coin flips). Once that derivation is automatic, the rest of the conjugate-family list is pattern matching. ~25 min.',
  },
  {
    unit: 5, slug: 'unit-5', title: 'When there\'s no closed form: MCMC',
    dueAssignment: 'Homework 4', dueDate: '2026-10-11',
    topics: ['Why most real posteriors have no closed-form solution', "Laplace's method as a quick approximation", 'The Metropolis and Metropolis-Hastings algorithms', 'Gibbs sampling', 'Hamiltonian Monte Carlo, briefly'],
    estMinutes: 60,
    firstStep: 'Before touching the algorithms, write down in one sentence what problem MCMC is solving: "I can\'t write the posterior in closed form, so I\'ll build a Markov chain whose stationary distribution *is* the posterior, and sample from that instead." Then trace one iteration of Metropolis-Hastings by hand on a toy 1-D target. ~25 min.',
  },
  {
    unit: 6, slug: 'unit-6', title: 'Probabilistic programming and PyMC',
    dueAssignment: 'Homework 5', dueDate: '2026-11-08',
    topics: ['What a probabilistic programming language buys you over hand-coded MCMC', 'Reading and drawing DAGs for a model', 'PyMC basics: loading data, specifying priors and likelihoods, sampling', 'Handling missing data, hypothesis testing, prediction, and censoring in PyMC', 'Custom likelihoods'],
    estMinutes: 50,
    firstStep: 'Install PyMC and run the single simplest example from the TA notes (areding.github.io/6420-pymc) end to end before opening Homework 5, get the environment working before the stats gets harder. ~30 min.',
  },
  {
    unit: 7, slug: 'unit-7', title: 'Hierarchical and linear models',
    dueAssignment: 'Homework 5', dueDate: '2026-11-08',
    topics: ['Hierarchical models: why partial pooling beats full pooling or no pooling', 'Bayesian ANOVA and regression', 'Factorial designs', 'GLMs, multinomial logit, multilevel models'],
    estMinutes: 55,
    firstStep: 'Sketch the DAG for a two-level hierarchical model on paper (say, test scores nested in classrooms) before opening PyMC. Seeing the pooling structure as a picture first makes the code much less mysterious. ~20 min.',
  },
  {
    unit: 8, slug: 'unit-8', title: 'Missing data and time-to-event models',
    dueAssignment: 'Homework 6', dueDate: '2026-11-22',
    topics: ['Mechanisms of missingness (MCAR, MAR, MNAR) and how Bayesian models handle them naturally', 'Survival analysis basics', 'Censoring', 'Time-to-event models in a Bayesian framework'],
    estMinutes: 45,
    firstStep: 'Write one paragraph on the difference between data missing-at-random and data missing-not-at-random, with an example of each from a domain you know. That distinction is what the whole unit hinges on. ~15 min.',
  },
  {
    unit: 9, slug: 'unit-9', title: 'Model checking, comparison, and selection',
    dueAssignment: 'Homework 6', dueDate: '2026-11-22',
    topics: ['Posterior predictive checks and model fit diagnostics', 'Deviance Information Criterion (DIC)', 'Conditional Predictive Ordinate (CPO)', 'Variable selection in a Bayesian setting'],
    estMinutes: 45,
    firstStep: 'Take a model you already built in an earlier unit and compute its DIC by hand from the formula, rather than trusting a library call, once, it demystifies what the number is actually penalizing. ~20 min.',
  },
  {
    unit: 10, slug: 'unit-10', title: 'Applied case studies',
    dueAssignment: 'Project & Final', dueDate: '2026-12-06',
    topics: ['Worked case studies pulling together priors, MCMC, hierarchical structure, and model checking end to end'],
    estMinutes: 40,
    firstStep: 'Pick the case study closest to your own project topic and read it once for structure only, how they moved from research question to model to posterior to conclusion, before you write a line of your own project. ~20 min.',
  },
]

export interface LsatTopicMeta {
  slug: string
  title: string
  family: string
  estMinutes: number
  firstStep: string
}

export const LSAT_TOPICS: LsatTopicMeta[] = [
  {
    slug: 'lr-assumption-family',
    title: 'LR: the Assumption family',
    family: 'Logical Reasoning',
    estMinutes: 25,
    firstStep: 'Take 5 necessary-assumption questions from any set you have on hand and run the negation test on every answer choice, even the ones that look obviously wrong. ~15 min.',
  },
  {
    slug: 'lr-structure-family',
    title: 'LR: the Structure family',
    family: 'Logical Reasoning',
    estMinutes: 20,
    firstStep: 'Take 5 stimuli (any type) and just find the conclusion using the "therefore" test, don\'t answer the actual question, just isolate the conclusion. ~10 min.',
  },
  {
    slug: 'lr-inference-family',
    title: 'LR: the Inference family',
    family: 'Logical Reasoning',
    estMinutes: 20,
    firstStep: 'Take 5 inference questions and, before looking at the answers, write your own one-sentence inference from the stimulus. Then see how close the credited answer is. ~15 min.',
  },
  {
    slug: 'lr-matching-family',
    title: 'LR: the Matching family',
    family: 'Logical Reasoning',
    estMinutes: 20,
    firstStep: 'Take one match-the-reasoning question and, before touching the answer choices, classify the stimulus\'s conclusion type (conditional, causal, comparative, predictive, value judgment). That one filter eliminates most wrong answers immediately. ~10 min.',
  },
  {
    slug: 'rc-primer',
    title: 'Reading Comprehension: the Scale and PEAR',
    family: 'Reading Comprehension',
    estMinutes: 30,
    firstStep: 'Read one passage using PEAR (Pause, Evaluate, Anticipate, Reread) and write a one-line function for each paragraph before answering any questions. ~15 min.',
  },
  {
    slug: 'traps-and-gaps',
    title: 'Trap & gap glossary (matches the tracker log exactly)',
    family: 'Reference',
    estMinutes: 15,
    firstStep: 'Skim the trap list once, then on your next logged question, name the trap on the wrong answer you picked before checking this glossary. ~10 min.',
  },
]
