
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBCNdT3rmoZlQLHC5hrnedlI4lcK9A62BQ",
  authDomain: "casequest-62b9b.firebaseapp.com",
  projectId: "casequest-62b9b",
  storageBucket: "casequest-62b9b.firebasestorage.app",
  messagingSenderId: "329872421373",
  appId: "1:329872421373:web:828b8c247e79e1233d2994",
  measurementId: "G-ED7SRYX2XK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const modules = [
    {
      id: 1,
      title: 'Introduction to Consulting',
      description: 'Learn the basics of the consulting industry and what it takes to succeed.',
      lessons: [
        { id: 1, title: 'What is Consulting?', xp: 10, type: 'lesson' },
        { id: 2, title: 'The Consultant Skillset', xp: 10, type: 'lesson' },
        { id: 3, title: 'Quiz 1', xp: 20, type: 'quiz' },
      ],
    },
    {
      id: 2,
      title: 'Core Frameworks',
      description: 'Master the essential frameworks used in case interviews.',
      lessons: [
        { id: 1, title: 'Profitability Framework', xp: 10, type: 'lesson' },
        { id: 2, title: 'Market Sizing', xp: 10, type: 'lesson' },
        { id: 3, title: 'Porter\'s Five Forces', xp: 10, type: 'lesson' },
        { id: 4, title: 'Quiz 2', xp: 20, type: 'quiz' },
      ],
    },
];

const cases = [
    {
      id: 1,
      title: 'GameBox Launch Strategy',
      difficulty: 'Medium',
      company: 'GameBox',
      industry: 'Gaming',
      content: 'Your client, GameBox, is a new entrant into the console gaming market...',
    },
    {
      id: 2,
      title: 'CoffeeCo Profit Decline',
      difficulty: 'Easy',
      company: 'CoffeeCo',
      industry: 'Food & Beverage',
      content: 'CoffeeCo, a large coffee chain, has seen its profits decline by 15% in the last year...',
    },
];

async function populateDatabase() {
  try {
    for (const moduleData of modules) {
      await addDoc(collection(db, 'modules'), moduleData);
    }
    console.log('Successfully populated modules collection.');

    for (const caseData of cases) {
      await addDoc(collection(db, 'cases'), caseData);
    }
    console.log('Successfully populated cases collection.');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase();
