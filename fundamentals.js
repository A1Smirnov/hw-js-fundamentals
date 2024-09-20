console.log(`Test console logout in JavaScript Fundamentals`);

// Include all data
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      { id: 1, name: "Declare a Variable", due_at: "2023-01-25", points_possible: 50 },
      { id: 2, name: "Write a Function", due_at: "2023-02-27", points_possible: 150 },
      { id: 3, name: "Code the World", due_at: "3156-11-15", points_possible: 500 }
    ]
  };
  
  const LearnerSubmissions = [
    { learner_id: 125, assignment_id: 1, submission: { submitted_at: "2023-01-25", score: 47 } },
    { learner_id: 125, assignment_id: 2, submission: { submitted_at: "2023-02-12", score: 150 } },
    { learner_id: 125, assignment_id: 3, submission: { submitted_at: "2023-01-25", score: 400 } },
    { learner_id: 132, assignment_id: 1, submission: { submitted_at: "2023-01-24", score: 39 } },
    { learner_id: 132, assignment_id: 2, submission: { submitted_at: "2023-03-07", score: 140 } }
  ];
  
  function getLearnerData(course, ag, submissions) {
    // Validation of Learners course, if not valid throw an error
    if (ag.course_id !== course.id) {
      throw new Error("AssignmentGroup course_id does not match CourseInfo id.");
    }
  // Create individual for each Learner objects which will return calculated data
    const results = {};
  
    submissions.forEach(submission => {
        // Destructurize data, looking for assignment_id via id
      const { learner_id, assignment_id, submission: sub } = submission;
      const assignment = ag.assignments.find(a => a.id === assignment_id);
        // If not assigned call for warning
      if (!assignment) {
        console.warn(`Assignment ID ${assignment_id} not found. Skipping.`);
        return; 
      }
  // Parsing data and convert it to "Date"
      const dueDate = new Date(assignment.due_at);
      const submittedDate = new Date(sub.submitted_at);
  // Check due Date, if it not expired then return
      if (dueDate > new Date()) return;
  // If Learner not scored - create new object
      if (!results[learner_id]) {
        results[learner_id] = { id: learner_id, avg: 0, totalScore: 0, totalPoints: 0, scores: {} };
      }
  // Validating score points >= 0 if not throw an error
      if (assignment.points_possible <= 0) {
        throw new Error(`Assignment ID ${assignment_id} has points_possible of ${assignment.points_possible}`);
      }
  // Calculating score
      let score = sub.score;
      // If it submitted later then a deadline minus 10% of score
      if (submittedDate > dueDate) {
        score -= (assignment.points_possible * 0.1); 
      }
  // Update results of Learner's score data
      results[learner_id].totalScore += score;
      results[learner_id].totalPoints += assignment.points_possible;
      results[learner_id].scores[assignment_id] = score / assignment.points_possible; 
    });
  // Returning new object values via creating array with all mined data
    return Object.values(results).map(({ id, totalScore, totalPoints, scores }) => {
        // If Learner has score then calculate average score, otherwise set it to zero value
      const avg = totalPoints > 0 ? totalScore / totalPoints : 0;
      return { id, avg, ...scores };
    });
  }
  // Try function - if error ocured - catch error message out to console
  try {
    const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
    console.log(result);
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
  