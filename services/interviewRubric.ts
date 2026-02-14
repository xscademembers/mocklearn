/**
 * Question bank and evaluation rubric for AI mock interviews.
 * Used by Gemini to pick question types and evaluate with the right metrics.
 */

export const QUESTION_RUBRIC = `
**QUESTION TYPES & EVALUATED METRICS**

1) TECHNICAL QUESTIONS
- Context: Link to JD (e.g. Finance/Accounting, Cost accounting, Analytical/IT). Examples: "Explain difference between debit and credit", "Calculate variance analysis", "Excel formula for compound interest", "Working capital management", "Data analysis tools (Excel/SQL) to solve a problem".
- Evaluated metrics: Technical correctness, JD match, Thinking structure (where relevant).

2) BEHAVIORAL QUESTIONS
- Context: Time management, teamwork, accountability, organizational skills, flexibility. Examples: "Tight deadline – how did you handle?", "Worked in team to achieve a goal", "Mistake at work – how did you fix?", "Prioritize when multiple deadlines overlap", "Adapt quickly to change".
- Evaluated metrics: Communication clarity, Thinking structure, Strengths/Weaknesses.

3) SCENARIO-BASED QUESTIONS
- Context: Real situations (budget overrun, supplier error, delayed data, presenting to non-finance, over-budget project). Examples: "Budget overrun in a department – what steps?", "Supplier delivered wrong quantities – how to handle?", "Report due but data delayed – how do you proceed?", "Present financial results to non-finance managers", "Project over budget – how prioritize corrective actions?".
- Evaluated metrics: Thinking structure, Technical correctness, Communication clarity, JD match as applicable.

**FRESHERS (entry-level / little work experience):**
- Technical: Basic concepts (assets vs liabilities, revenue recognition, profit margin, Excel/Sheets for data, role of cost accountant). Metrics: Technical correctness, JD match, Thinking structure.
- Behavioral: Use college projects, assignments, exams, college events, mentors. Examples: "College project – your role", "Tight deadline during assignments/exams", "Led team in college events", "Handle feedback from professors/mentors", "Resolved conflict in a team". Metrics: Communication clarity, Thinking structure, Strengths/Weaknesses.
- Scenario: Simplified (group project member not contributing, slide deck fails during presentation, error in internship report, explain concept to classmates, multiple assignments same deadline). Metrics: Thinking structure, Communication clarity, Technical correctness, JD match.

**EVALUATION METRICS SUMMARY:**
- Technical correctness: Accuracy of technical/finance/accounting/content answers.
- JD match: Fit with job description requirements.
- Thinking structure: Logic, structure (e.g. STAR), flow of answer.
- Communication clarity: Language, clarity, articulation.
- Strengths/Weaknesses: Identify from answers for behavioral/scenario.
`;
