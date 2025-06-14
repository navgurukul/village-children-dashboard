
export interface StudentData {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  block: string;
  cluster: string;
  village: string;
  panchayat: string;
  schoolStatus: 'Enrolled' | 'Dropout' | 'Never Enrolled';
  enrollmentDate?: string;
  dropoutReason?: string;
  class?: string;
  school?: string;
}

export interface FilterOptions {
  block: string;
  cluster: string;
  village: string;
  panchayat: string;
  gender: string;
  schoolStatus: string;
}

// Mock data generation
const blocks = ['Block A', 'Block B', 'Block C', 'Block D'];
const clusters = ['Cluster 1', 'Cluster 2', 'Cluster 3', 'Cluster 4', 'Cluster 5'];
const villages = [
  'Rampur', 'Shyampur', 'Krishnapur', 'Gopalpur', 'Madhavpur',
  'Radhakrishna', 'Haripur', 'Sitapur', 'Govindpur', 'Laxmipur'
];
const panchayats = ['Panchayat 1', 'Panchayat 2', 'Panchayat 3', 'Panchayat 4'];
const schoolStatuses: StudentData['schoolStatus'][] = ['Enrolled', 'Dropout', 'Never Enrolled'];
const genders: StudentData['gender'][] = ['Male', 'Female'];
const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
const schools = ['Primary School A', 'Primary School B', 'Middle School A', 'Middle School B', 'High School A'];

const firstNames = [
  'Raj', 'Priya', 'Amit', 'Sunita', 'Vikash', 'Pooja', 'Rahul', 'Kavita',
  'Suresh', 'Meera', 'Ravi', 'Sita', 'Manoj', 'Rekha', 'Ajay', 'Nisha',
  'Deepak', 'Anita', 'Sandeep', 'Geeta', 'Vinod', 'Lata', 'Ashok', 'Usha'
];

const lastNames = [
  'Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Yadav', 'Prasad', 'Mishra',
  'Pandey', 'Tiwari', 'Jha', 'Chandra', 'Das', 'Roy', 'Devi', 'Kumari'
];

const dropoutReasons = [
  'Financial constraints',
  'Family responsibilities',
  'Migration',
  'Lack of interest',
  'Early marriage',
  'Health issues',
  'Distance to school',
  'Quality of education'
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMockStudent(id: number): StudentData {
  const gender = getRandomItem(genders);
  const schoolStatus = getRandomItem(schoolStatuses);
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  
  return {
    id: `STU${id.toString().padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    age: Math.floor(Math.random() * 10) + 6, // Age 6-15
    gender,
    block: getRandomItem(blocks),
    cluster: getRandomItem(clusters),
    village: getRandomItem(villages),
    panchayat: getRandomItem(panchayats),
    schoolStatus,
    enrollmentDate: schoolStatus === 'Enrolled' ? '2023-04-01' : undefined,
    dropoutReason: schoolStatus === 'Dropout' ? getRandomItem(dropoutReasons) : undefined,
    class: schoolStatus === 'Enrolled' ? getRandomItem(classes) : undefined,
    school: schoolStatus === 'Enrolled' ? getRandomItem(schools) : undefined,
  };
}

// Generate 500 mock students
export const mockStudentData: StudentData[] = Array.from({ length: 500 }, (_, i) => 
  generateMockStudent(i + 1)
);
