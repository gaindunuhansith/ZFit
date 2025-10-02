import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

export const generatePDFReport = async (reportData: ReportData): Promise<Buffer> => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('ZFit Tracking Report', 20, 20);
  
  // Add report info
  doc.setFontSize(12);
  doc.text(`Report Type: ${reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)}`, 20, 35);
  doc.text(`Period: ${reportData.startDate.toLocaleDateString()} - ${reportData.endDate.toLocaleDateString()}`, 20, 45);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
  
  // Add summary section
  doc.setFontSize(16);
  doc.text('Summary', 20, 75);
  
  doc.setFontSize(12);
  doc.text(`Total Workouts: ${reportData.summary.totalWorkouts}`, 20, 90);
  doc.text(`Total Calories: ${reportData.summary.totalCalories.toLocaleString()}`, 20, 100);
  doc.text(`Active Goals: ${reportData.summary.totalGoals}`, 20, 110);
  doc.text(`Completed Goals: ${reportData.summary.completedGoals}`, 20, 120);
  doc.text(`Average Workouts/Day: ${reportData.summary.averageWorkoutsPerDay.toFixed(1)}`, 20, 130);
  
  let yPosition = 150;
  
  // Add workouts section if data exists
  if (reportData.data.workouts.length > 0) {
    doc.setFontSize(16);
    doc.text('Workouts', 20, yPosition);
    yPosition += 15;
    
    const workoutData = reportData.data.workouts.map(workout => [
      workout.exercise,
      workout.sets.toString(),
      workout.reps.toString(),
      `${workout.weight}kg`,
      new Date(workout.date).toLocaleDateString()
    ]);
    
    (doc as any).autoTable({
      head: [['Exercise', 'Sets', 'Reps', 'Weight', 'Date']],
      body: workoutData,
      startY: yPosition,
      margin: { left: 20 },
      styles: { fontSize: 10 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Add nutrition section if data exists
  if (reportData.data.nutrition.length > 0 && yPosition < 250) {
    doc.setFontSize(16);
    doc.text('Nutrition', 20, yPosition);
    yPosition += 15;
    
    const nutritionData = reportData.data.nutrition.map(meal => [
      meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1),
      meal.calories.toString(),
      meal.macros?.protein?.toString() || '0',
      meal.macros?.carbs?.toString() || '0',
      meal.macros?.fats?.toString() || '0',
      new Date(meal.date).toLocaleDateString()
    ]);
    
    (doc as any).autoTable({
      head: [['Meal Type', 'Calories', 'Protein(g)', 'Carbs(g)', 'Fats(g)', 'Date']],
      body: nutritionData,
      startY: yPosition,
      margin: { left: 20 },
      styles: { fontSize: 10 }
    });
  }
  
  // Add new page for goals if needed
  if (reportData.data.goals.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Goals', 20, 20);
    
    const goalData = reportData.data.goals.map(goal => [
      goal.goalType.replace('_', ' ').charAt(0).toUpperCase() + goal.goalType.replace('_', ' ').slice(1),
      goal.target,
      goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline',
      goal.deadline && new Date(goal.deadline) <= new Date() ? 'Completed' : 'Active'
    ]);
    
    (doc as any).autoTable({
      head: [['Goal Type', 'Target', 'Deadline', 'Status']],
      body: goalData,
      startY: 35,
      margin: { left: 20 },
      styles: { fontSize: 10 }
    });
  }
  
  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
};
