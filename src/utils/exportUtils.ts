import { StudentData } from '@/data/mockData';

// Type for children data from API
interface ChildData {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  para: string; 
  aadhaar: string;
  aadhaarNumber: string;
  schoolName: string;
  school: string;
  schoolStatus: string;
  schoolType?: string; 
  block: string;
  gramPanchayat: string;
  disability: string;
  caste: string;
  fatherName: string;
  motherName: string;
  motherEducated: string;
  fatherEducated: string;
  dob: string;
  familyOccupation: string;
  parentsStatus: string;
  livesWithWhom: string;
  houseNumber?: string;
  economicStatus?: string;
  
  // Additional survey fields
  motherTongue?: string;
  otherMotherTongue?: string;
  otherOccupation?: string;
  otherCaste?: string;
  otherLivesWith?: string;
  rationCardType?: string;
  rationCardNumber?: string;
  attendanceStatus?: string;
  currentClass?: string;
  educationCategory?: string;
  lastClassStudied?: string | string[];
  schoolCommuteType?: string; 
  dropoutReasons?: string | string[];
  otherDropoutReason?: string | string[];
  neverEnrolledReasons?: string | string[];
  otherNeverEnrolledReason?: string | string[];
  hasCasteCertificate?: string;
  hasResidenceCertificate?: string;
  hasAadhaar?: string;
  disabilityTypes?: string | string[];
  otherDisability?: string;
  goesToSchool?: string;
  surveyedAt?: string;  // Adding field for survey timestamp
}

export const downloadChildrenCSV = (data: ChildData[], filename: string) => {
  const headers = [
    'ID', 'Name', 'Age', 'Gender', 'Has Aadhaar', 'Aadhaar Number', 'Block', 'Gram Panchayat', 'Village', 'Para',
    'Date of Birth', 'Father Name', 'Mother Name','Mother Educated', 'Father Educated', 'House Number', 
    'Family Occupation', 'Other Occupation', 'Caste', 'Other Caste', 'Parents Status', 'Lives with whom', 
    'Other Lives With Whom', 'Mother Tongue',
    'Goes To School', 
    'Education Status', 'School Name', 'School Type', 'Attendance Status', 'Current Class', 'Living Arrangement', 
    'Last  Studied Class', 'Dropout Reasons', 'Never Enrolled Reasons', 
    'Ration Card Type', 'Ration Card Number', 'Has Caste Certificate',
    'Has Residence Certificate', 'Disability', 'Disability Types', 'Surveyed At'
  ];
  const csvContent = [  
    headers.join(','),

    ...data.map(child => {
      // Format mother tongue to include "other" value if applicable
      const motherTongueFormatted = (child.motherTongue === "अन्य" || child.motherTongue === "Other") && child.otherMotherTongue 
        ? `${child.motherTongue} (${child.otherMotherTongue})` 
        : child.motherTongue;

      // Format family occupation to include "other" value if applicable
      const familyOccupationFormatted = (child.familyOccupation === "अन्य" || child.familyOccupation === "Other") && child.otherOccupation 
        ? `${child.familyOccupation} (${child.otherOccupation})` 
        : child.familyOccupation;

      // Format caste to include "other" value if applicable
      const casteFormatted = (child.caste === "अन्य" || child.caste === "Other") && child.otherCaste 
        ? `${child.caste} (${child.otherCaste})` 
        : child.caste;

      // Format "lives with" to include "other" value if applicable
      const livesWithFormatted = (child.livesWithWhom === "अन्य" || child.livesWithWhom === "Other") && child.otherLivesWith 
        ? `${child.livesWithWhom} (${child.otherLivesWith})` 
        : child.livesWithWhom;

      return [
        child.id,
        `"${child.name}"`,
        child.age,
        `"${child.gender}"`,
        child.hasAadhaar || '-', 
        child.aadhaarNumber || '-',
        `"${child.block || '-'}"`,
        `"${child.gramPanchayat || '-'}"`,
        `"${child.village || '-'}"`,
        `"${child.para || '-'}"`,
        child.dob || '-', 
        `"${child.fatherName || '-'}"`,
        `"${child.motherName || '-'}"`,
        `"${child.motherEducated || '-'}"`,
        `"${child.fatherEducated || '-'}"`,
        `"${child.houseNumber || '-'}"`,
        `"${familyOccupationFormatted || '-'}"`,
        `"${child.otherOccupation || '-'}"`,
        `"${child.caste || '-'}"`,
        `"${child.otherCaste || '-'}"`,
        `"${child.parentsStatus || '-'}"`,
        `"${child.livesWithWhom || '-'}"`,
        `"${child.otherLivesWith || '-'}"`,
        `"${motherTongueFormatted || '-'}"`,
        `"${child.goesToSchool || '-'}"`,
        `"${child.schoolStatus || '-'}"`,
        `"${child.schoolName || '-'}"`,
        `"${child.schoolType || '-'}"`,
        `"${child.attendanceStatus || '-'}"`,
        `"${child.currentClass || '-'}"`,
        `"${child.schoolCommuteType || '-'}"`,
        `"${child.lastClassStudied || '-'}"`,
        `"${Array.isArray(child.dropoutReasons) ? child.dropoutReasons.join('; ') : (child.dropoutReasons || '-')}"`,
        `"${Array.isArray(child.neverEnrolledReasons) ? child.neverEnrolledReasons.join('; ') : (child.neverEnrolledReasons || '-')}"`,
        `"${child.rationCardType || '-'}"`,
        `"${child.rationCardNumber || '-'}"`,
        `"${child.hasCasteCertificate || '-'}"`,
        `"${child.hasResidenceCertificate || '-'}"`,
        `"${child.disability || '-'}"`,
        `"${Array.isArray(child.disabilityTypes) ? child.disabilityTypes.join('; ') : (child.disabilityTypes || '-')}"`,
        `"${child.surveyedAt || '-'}"`,
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadCSV = (data: StudentData[], filename: string) => {
  const headers = [
    'ID', 'Name', 'Age', 'Gender', 'Block', 'Cluster', 'Village', 
    'Panchayat', 'School Status', 'Class', 'School', 'Enrollment Date', 'Dropout Reason'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(student => [
      student.id,
      `"${student.name}"`,
      student.age,
      student.gender,
      `"${student.block || '-'}"`,
      `"${student.cluster || '-'}"`,
      `"${student.village || '-'}"`,
      `"${student.panchayat || '-'}"`,
      `"${student.schoolStatus || '-'}"`,
      student.class ? `"${student.class}"` : '"-"',
      student.school ? `"${student.school}"` : '"-"',
      student.enrollmentDate || '-',
      student.dropoutReason ? `"${student.dropoutReason}"` : '"-"'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPDF = (data: StudentData[], stats: any, filename: string) => {
  // Create a simple HTML structure for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Data Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #333; }
        .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .summary { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Student Data Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div class="summary">
        <h2>Summary Statistics</h2>
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${stats.totalStudents}</div>
            <div class="stat-label">Total Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.enrolledCount}</div>
            <div class="stat-label">Enrolled</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.dropoutCount}</div>
            <div class="stat-label">Dropouts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.neverEnrolledCount}</div>
            <div class="stat-label">Never Enrolled</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.maleCount}</div>
            <div class="stat-label">Male Students</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.femaleCount}</div>
            <div class="stat-label">Female Students</div>
          </div>
        </div>
      </div>

      <h2>Student Details</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Block</th>
            <th>Cluster</th>
            <th>Village</th>
            <th>Panchayat</th>
            <th>Status</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(student => `
            <tr>
              <td>${student.id}</td>
              <td>${student.name}</td>
              <td>${student.age}</td>
              <td>${student.gender}</td>
              <td>${student.block}</td>
              <td>${student.cluster}</td>
              <td>${student.village}</td>
              <td>${student.panchayat}</td>
              <td>${student.schoolStatus}</td>
              <td>${student.class || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }
};
