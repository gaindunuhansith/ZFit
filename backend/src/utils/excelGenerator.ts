import * as XLSX from 'xlsx';

interface ReportData {
  type: string;
  startDate: Date;
  endDate: Date;
  memberId?: string;
  summary: {
    totalWorkouts: number;
    totalCalories: number;
    totalGoals: number;
    completedGoals: number;
    averageWorkoutsPerDay: number;
  };
  data: {
    workouts: any[];
    nutrition: any[];
    goals: any[];
    progress: any[];
  };
}

export const generateExcelReport = async (reportData: ReportData): Promise<Buffer> => {
  const workbook = XLSX.utils.book_new();
  
  // Create Summary sheet
  const summaryData = [
    ['ZFit Tracking Report'],
    [''],
    ['Report Type', reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)],
    ['Period', `${reportData.startDate.toLocaleDateString()} - ${reportData.endDate.toLocaleDateString()}`],
    ['Generated', new Date().toLocaleDateString()],
    [''],
    ['Summary Statistics'],
    ['Total Workouts', reportData.summary.totalWorkouts],
    ['Total Calories', reportData.summary.totalCalories],
    ['Active Goals', reportData.summary.totalGoals],
    ['Completed Goals', reportData.summary.completedGoals],
    ['Average Workouts/Day', reportData.summary.averageWorkoutsPerDay.toFixed(1)]
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Create Workouts sheet if data exists
  if (reportData.data.workouts.length > 0) {
    const workoutData = [
      ['Exercise', 'Sets', 'Reps', 'Weight (kg)', 'Notes', 'Date'],
      ...reportData.data.workouts.map(workout => [
        workout.exercise,
        workout.sets,
        workout.reps,
        workout.weight,
        workout.notes || '',
        new Date(workout.date).toLocaleDateString()
      ])
    ];
    
    const workoutSheet = XLSX.utils.aoa_to_sheet(workoutData);
    XLSX.utils.book_append_sheet(workbook, workoutSheet, 'Workouts');
  }
  
  // Create Nutrition sheet if data exists
  if (reportData.data.nutrition.length > 0) {
    const nutritionData = [
      ['Meal Type', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fats (g)', 'Notes', 'Date'],
      ...reportData.data.nutrition.map(meal => [
        meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1),
        meal.calories,
        meal.macros?.protein || 0,
        meal.macros?.carbs || 0,
        meal.macros?.fats || 0,
        meal.notes || '',
        new Date(meal.date).toLocaleDateString()
      ])
    ];
    
    const nutritionSheet = XLSX.utils.aoa_to_sheet(nutritionData);
    XLSX.utils.book_append_sheet(workbook, nutritionSheet, 'Nutrition');
  }
  
  // Create Goals sheet if data exists
  if (reportData.data.goals.length > 0) {
    const goalData = [
      ['Goal Type', 'Target', 'Deadline', 'Status'],
      ...reportData.data.goals.map(goal => [
        goal.goalType.replace('_', ' ').charAt(0).toUpperCase() + goal.goalType.replace('_', ' ').slice(1),
        goal.target,
        goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline',
        goal.deadline && new Date(goal.deadline) <= new Date() ? 'Completed' : 'Active'
      ])
    ];
    
    const goalSheet = XLSX.utils.aoa_to_sheet(goalData);
    XLSX.utils.book_append_sheet(workbook, goalSheet, 'Goals');
  }
  
  // Convert to buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return excelBuffer;
};
