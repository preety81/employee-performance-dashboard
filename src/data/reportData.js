// ==============================================================================
// Student Project Data File: 20 Employee Daily Work Reports
// - Includes exact 19-day logs for Sneha Reddy from the provided PDF / Sheet
// - Includes 19 other realistic team members across various departments
// ==============================================================================

export const initialEmployeesData = [
  {
    id: "EMP-001",
    name: "Sneha Reddy",
    role: "Content Writing Intern",
    email: "sneha.reddy@company.com",
    monthYear: "September 2026",
    dailyLogs: [
      { date: "01-09-2026", dayNo: 1, todayGoal: "Close out pending items from yesterday", tasksCompleted: 4, plannedHrs: 5.5, actualHrs: 5.0, qualityRating: 4, progressPct: 73, blockerSeverity: "Low", blocker: "Minor technical roadblock", selfRating: 3 },
      { date: "02-09-2026", dayNo: 2, todayGoal: "Wrap up task and start next one", tasksCompleted: 2, plannedHrs: 6.0, actualHrs: 5.0, qualityRating: 4, progressPct: 94, blockerSeverity: "None", blocker: "None", selfRating: 3 },
      { date: "03-09-2026", dayNo: 3, todayGoal: "Get feedback on work in progress", tasksCompleted: 4, plannedHrs: 6.0, actualHrs: 6.5, qualityRating: 3, progressPct: 70, blockerSeverity: "Low", blocker: "Tooling/environment issue", selfRating: 5 },
      { date: "04-09-2026", dayNo: 4, todayGoal: "Complete current sprint deliverable", tasksCompleted: 2, plannedHrs: 7.5, actualHrs: 7.5, qualityRating: 5, progressPct: 71, blockerSeverity: "Low", blocker: "Tooling/environment issue", selfRating: 5 },
      { date: "07-09-2026", dayNo: 5, todayGoal: "Make progress on assigned task", tasksCompleted: 4, plannedHrs: 5.0, actualHrs: 4.5, qualityRating: 3, progressPct: 67, blockerSeverity: "Low", blocker: "Tooling/environment issue", selfRating: 4 },
      { date: "08-09-2026", dayNo: 6, todayGoal: "Wrap up task and start next one", tasksCompleted: 2, plannedHrs: 5.5, actualHrs: 5.5, qualityRating: 4, progressPct: 93, blockerSeverity: "Low", blocker: "Dependency on another team", selfRating: 3 },
      { date: "09-09-2026", dayNo: 7, todayGoal: "Get feedback on work in progress", tasksCompleted: 4, plannedHrs: 6.0, actualHrs: 5.5, qualityRating: 4, progressPct: 83, blockerSeverity: "Low", blocker: "Unclear requirements initially", selfRating: 4 },
      { date: "10-09-2026", dayNo: 8, todayGoal: "Wrap up task and start next one", tasksCompleted: 4, plannedHrs: 7.0, actualHrs: 8.0, qualityRating: 3, progressPct: 69, blockerSeverity: "Low", blocker: "Dependency on another team", selfRating: 3 },
      { date: "11-09-2026", dayNo: 9, todayGoal: "Complete current sprint deliverable", tasksCompleted: 3, plannedHrs: 6.0, actualHrs: 6.5, qualityRating: 5, progressPct: 74, blockerSeverity: "Low", blocker: "Minor technical roadblock", selfRating: 4 },
      { date: "14-09-2026", dayNo: 10, todayGoal: "Get feedback on work in progress", tasksCompleted: 2, plannedHrs: 8.0, actualHrs: 7.0, qualityRating: 3, progressPct: 96, blockerSeverity: "Medium", blocker: "Dependency on another team", selfRating: 5 },
      { date: "15-09-2026", dayNo: 11, todayGoal: "Make progress on assigned task", tasksCompleted: 4, plannedHrs: 7.5, actualHrs: 7.5, qualityRating: 5, progressPct: 93, blockerSeverity: "None", blocker: "None", selfRating: 5 },
      { date: "16-09-2026", dayNo: 12, todayGoal: "Wrap up task and start next one", tasksCompleted: 2, plannedHrs: 6.5, actualHrs: 6.0, qualityRating: 3, progressPct: 73, blockerSeverity: "Low", blocker: "Waiting on teammate review", selfRating: 5 },
      { date: "17-09-2026", dayNo: 13, todayGoal: "Wrap up task and start next one", tasksCompleted: 3, plannedHrs: 6.5, actualHrs: 7.5, qualityRating: 5, progressPct: 69, blockerSeverity: "None", blocker: "None", selfRating: 3 },
      { date: "18-09-2026", dayNo: 14, todayGoal: "Complete current sprint deliverable", tasksCompleted: 3, plannedHrs: 7.5, actualHrs: 6.5, qualityRating: 3, progressPct: 98, blockerSeverity: "None", blocker: "None", selfRating: 5 },
      { date: "21-09-2026", dayNo: 15, todayGoal: "Wrap up task and start next one", tasksCompleted: 4, plannedHrs: 6.0, actualHrs: 6.5, qualityRating: 5, progressPct: 99, blockerSeverity: "None", blocker: "None", selfRating: 4 },
      { date: "22-09-2026", dayNo: 16, todayGoal: "Wrap up task and start next one", tasksCompleted: 4, plannedHrs: 8.0, actualHrs: 9.0, qualityRating: 4, progressPct: 78, blockerSeverity: "Medium", blocker: "Dependency on another team", selfRating: 5 },
      { date: "23-09-2026", dayNo: 17, todayGoal: "Complete current sprint deliverable", tasksCompleted: 3, plannedHrs: 6.5, actualHrs: 7.0, qualityRating: 3, progressPct: 93, blockerSeverity: "Low", blocker: "Dependency on another team", selfRating: 5 },
      { date: "24-09-2026", dayNo: 18, todayGoal: "Make progress on assigned task", tasksCompleted: 3, plannedHrs: 6.5, actualHrs: 6.0, qualityRating: 3, progressPct: 94, blockerSeverity: "None", blocker: "None", selfRating: 4 },
      { date: "25-09-2026", dayNo: 19, todayGoal: "Make progress on assigned task", tasksCompleted: 3, plannedHrs: 8.0, actualHrs: 9.0, qualityRating: 3, progressPct: 75, blockerSeverity: "Medium", blocker: "Minor technical roadblock", selfRating: 4 }
    ]
  },
  {
    id: "EMP-002",
    name: "Aarav Sharma",
    role: "Senior Frontend Developer",
    email: "aarav.sharma@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 4.5, basePlanned: 7.5, baseActual: 7.0, baseQuality: 4.7, baseProgress: 94, riskBias: 0.08 })
  },
  {
    id: "EMP-003",
    name: "Pooja Verma",
    role: "Backend Engineer",
    email: "pooja.verma@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.8, basePlanned: 8.0, baseActual: 7.8, baseQuality: 4.4, baseProgress: 88, riskBias: 0.12 })
  },
  {
    id: "EMP-004",
    name: "Rohan Kulkarni",
    role: "Full Stack Engineer",
    email: "rohan.kulkarni@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 4.6, basePlanned: 8.0, baseActual: 7.4, baseQuality: 4.8, baseProgress: 96, riskBias: 0.06 })
  },
  {
    id: "EMP-005",
    name: "Ananya Iyer",
    role: "UI/UX Designer",
    email: "ananya.iyer@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.5, basePlanned: 7.0, baseActual: 6.8, baseQuality: 4.5, baseProgress: 90, riskBias: 0.1 })
  },
  {
    id: "EMP-006",
    name: "Vikram Malhotra",
    role: "DevOps Engineer",
    email: "vikram.malhotra@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 2.8, basePlanned: 8.0, baseActual: 8.6, baseQuality: 3.8, baseProgress: 81, riskBias: 0.28 })
  },
  {
    id: "EMP-007",
    name: "Neha Gupta",
    role: "QA Automation Engineer",
    email: "neha.gupta@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 5.0, basePlanned: 7.5, baseActual: 7.2, baseQuality: 4.7, baseProgress: 95, riskBias: 0.07 })
  },
  {
    id: "EMP-008",
    name: "Karan Patel",
    role: "Data Analyst Intern",
    email: "karan.patel@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 2.3, basePlanned: 7.0, baseActual: 8.4, baseQuality: 3.1, baseProgress: 68, riskBias: 0.48 })
  },
  {
    id: "EMP-009",
    name: "Meera Nair",
    role: "Product Management Intern",
    email: "meera.nair@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.2, basePlanned: 7.0, baseActual: 7.1, baseQuality: 4.1, baseProgress: 85, riskBias: 0.18 })
  },
  {
    id: "EMP-010",
    name: "Aditya Joshi",
    role: "Frontend Developer",
    email: "aditya.joshi@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.9, basePlanned: 7.5, baseActual: 7.3, baseQuality: 4.3, baseProgress: 89, riskBias: 0.14 })
  },
  {
    id: "EMP-011",
    name: "Tanvi Deshmukh",
    role: "Content Strategist",
    email: "tanvi.deshmukh@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.6, basePlanned: 6.5, baseActual: 6.4, baseQuality: 4.2, baseProgress: 86, riskBias: 0.16 })
  },
  {
    id: "EMP-012",
    name: "Rahul Saxena",
    role: "Junior Backend Developer",
    email: "rahul.saxena@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 2.0, basePlanned: 7.5, baseActual: 9.1, baseQuality: 2.8, baseProgress: 63, riskBias: 0.55 })
  },
  {
    id: "EMP-013",
    name: "Ishita Sen",
    role: "Security Analyst",
    email: "ishita.sen@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.0, basePlanned: 8.0, baseActual: 7.8, baseQuality: 4.5, baseProgress: 91, riskBias: 0.13 })
  },
  {
    id: "EMP-014",
    name: "Varun Mehta",
    role: "Mobile App Developer",
    email: "varun.mehta@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 4.2, basePlanned: 7.5, baseActual: 7.1, baseQuality: 4.6, baseProgress: 93, riskBias: 0.09 })
  },
  {
    id: "EMP-015",
    name: "Divya Chauhan",
    role: "Graphic Designer",
    email: "divya.chauhan@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.4, basePlanned: 6.5, baseActual: 6.7, baseQuality: 3.8, baseProgress: 79, riskBias: 0.26 })
  },
  {
    id: "EMP-016",
    name: "Siddharth Rao",
    role: "Cloud Architect",
    email: "siddharth.rao@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.8, basePlanned: 8.0, baseActual: 7.5, baseQuality: 4.7, baseProgress: 95, riskBias: 0.08 })
  },
  {
    id: "EMP-017",
    name: "Priyanka Mishra",
    role: "Technical Writer",
    email: "priyanka.mishra@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.5, basePlanned: 6.5, baseActual: 6.5, baseQuality: 4.0, baseProgress: 84, riskBias: 0.2 })
  },
  {
    id: "EMP-018",
    name: "Harshvardhan Jain",
    role: "QA Manual Tester",
    email: "harsh.jain@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 2.1, basePlanned: 7.0, baseActual: 8.6, baseQuality: 3.0, baseProgress: 65, riskBias: 0.52 })
  },
  {
    id: "EMP-019",
    name: "Kavita Pillai",
    role: "Scrum Master & PM",
    email: "kavita.pillai@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 4.1, basePlanned: 7.5, baseActual: 7.2, baseQuality: 4.6, baseProgress: 92, riskBias: 0.1 })
  },
  {
    id: "EMP-020",
    name: "Nikhil Bansal",
    role: "Database Administrator",
    email: "nikhil.bansal@company.com",
    monthYear: "September 2026",
    dailyLogs: generateEmployeeLogs(19, { baseTasks: 3.3, basePlanned: 7.5, baseActual: 7.7, baseQuality: 3.9, baseProgress: 81, riskBias: 0.22 })
  }
];

// Helper to generate consistent daily logs for simulated team members
function generateEmployeeLogs(numDays, config) {
  const dates = [
    "01-09-2026", "02-09-2026", "03-09-2026", "04-09-2026", "07-09-2026",
    "08-09-2026", "09-09-2026", "10-09-2026", "11-09-2026", "14-09-2026",
    "15-09-2026", "16-09-2026", "17-09-2026", "18-09-2026", "21-09-2026",
    "22-09-2026", "23-09-2026", "24-09-2026", "25-09-2026"
  ];

  const goals = [
    "Complete sprint deliverable",
    "Resolve backlog defects and test",
    "Review pull requests and documentation",
    "Implement core service logic",
    "Investigate bottlenecks and optimize",
    "Feature release regression testing"
  ];

  const blockersList = [
    { text: "None", severity: "None" },
    { text: "Minor technical roadblock", severity: "Low" },
    { text: "Dependency on another team", severity: "Medium" },
    { text: "Tooling/environment issue", severity: "Low" },
    { text: "API test env down", severity: "High" }
  ];

  // Smooth, realistic business momentum cycles (ramp-up, deep execution, milestone deliveries)
  const dayPatterns = [
    { qMod: 0.05, pMod: 2, tMod: 0, hrsMod: -0.2 },  // Day 1: Sprint kick-off
    { qMod: 0.12, pMod: 4, tMod: 0, hrsMod: -0.1 },  // Day 2: Getting into flow
    { qMod: 0.18, pMod: 6, tMod: 1, hrsMod: 0.0 },   // Day 3: Steady development
    { qMod: 0.25, pMod: 8, tMod: 1, hrsMod: 0.1 },   // Day 4: Strong progress
    { qMod: 0.20, pMod: 5, tMod: 0, hrsMod: -0.2 },  // Day 5: End of week checkpoint
    { qMod: 0.22, pMod: 6, tMod: 0, hrsMod: 0.0 },   // Day 6: Week 2 start
    { qMod: 0.28, pMod: 8, tMod: 1, hrsMod: 0.1 },   // Day 7: Core execution
    { qMod: 0.15, pMod: 3, tMod: 0, hrsMod: 0.3 },   // Day 8: Dependency review
    { qMod: 0.30, pMod: 9, tMod: 1, hrsMod: 0.1 },   // Day 9: Milestone delivery
    { qMod: 0.25, pMod: 6, tMod: 0, hrsMod: -0.1 },  // Day 10: Feedback sync
    { qMod: 0.35, pMod: 10, tMod: 1, hrsMod: 0.2 },  // Day 11: High productivity
    { qMod: 0.30, pMod: 8, tMod: 1, hrsMod: 0.0 },   // Day 12: Integration testing
    { qMod: 0.26, pMod: 7, tMod: 0, hrsMod: -0.1 },  // Day 13: Review & polish
    { qMod: 0.32, pMod: 9, tMod: 1, hrsMod: 0.1 },   // Day 14: Documentation sync
    { qMod: 0.38, pMod: 11, tMod: 1, hrsMod: 0.2 },  // Day 15: Demo day
    { qMod: 0.22, pMod: 5, tMod: 0, hrsMod: 0.2 },   // Day 16: Post-demo triage
    { qMod: 0.28, pMod: 7, tMod: 1, hrsMod: 0.0 },   // Day 17: Backlog clearance
    { qMod: 0.25, pMod: 6, tMod: 0, hrsMod: -0.1 },  // Day 18: Retro & next sprint
    { qMod: 0.30, pMod: 8, tMod: 1, hrsMod: 0.1 }   // Day 19: Month wrap-up
  ];

  return Array.from({ length: numDays }, (_, i) => {
    const pattern = dayPatterns[i % dayPatterns.length];
    const indRandom = (Math.sin((i + 1) * config.baseTasks) * 0.4);
    
    const tasksCompleted = Math.max(1, Math.min(6, Math.round(config.baseTasks + pattern.tMod + indRandom)));
    const plannedHrs = parseFloat(config.basePlanned.toFixed(1));
    const actualHrs = parseFloat(Math.max(4.0, (config.baseActual + pattern.hrsMod + indRandom * 0.8)).toFixed(1));
    
    // Dynamic realistic quality rating (1 to 5)
    let qVal = config.baseQuality + pattern.qMod + indRandom * 0.5;
    const qualityRating = Math.max(1, Math.min(5, Math.round(qVal)));

    // Dynamic progress %
    let pVal = config.baseProgress + pattern.pMod + indRandom * 8;
    const progressPct = Math.max(45, Math.min(100, Math.round(pVal)));

    // Deterministic blocker assignment (avoiding Math.random hydration mismatch)
    const pseudoRandom = ((i * 13 + Math.round(config.baseTasks * 7)) % 100) / 100;
    const hasBlocker = pseudoRandom < config.riskBias;
    const blockerIndex = ((i * 3 + 1) % (blockersList.length - 1)) + 1;
    const selectedBlocker = hasBlocker ? blockersList[blockerIndex] : blockersList[0];

    const selfRating = Math.min(5, Math.max(1, Math.round(qualityRating - (hasBlocker ? 1 : 0) + (i % 2 === 0 ? 1 : 0))));

    return {
      date: dates[i] || `Day-${i + 1}`,
      dayNo: i + 1,
      todayGoal: goals[i % goals.length],
      tasksCompleted,
      plannedHrs,
      actualHrs,
      qualityRating,
      progressPct,
      blockerSeverity: selectedBlocker.severity,
      blocker: selectedBlocker.text,
      selfRating
    };
  });
}
