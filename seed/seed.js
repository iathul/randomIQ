require('dotenv').config()
const mongoose = require('mongoose')
const Question = require('../models/question')

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const questions = [
  {
    questionText: 'What is the capital of Japan?',
    options: ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'],
    correctAnswer: 'Tokyo'
  },
  {
    questionText: "Which gas is most abundant in the Earth's atmosphere?",
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 'Nitrogen'
  },
  {
    questionText: 'Who wrote the play "Romeo and Juliet"?',
    options: [
      'William Shakespeare',
      'Jane Austen',
      'Charles Dickens',
      'F. Scott Fitzgerald'
    ],
    correctAnswer: 'William Shakespeare'
  },
  {
    questionText: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 'Blue Whale'
  },
  {
    questionText:
      'Which planet is known as the "Morning Star" or "Evening Star"?',
    options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
    correctAnswer: 'Venus'
  },
  {
    questionText: 'What is the chemical symbol for gold?',
    options: ['Au', 'Ag', 'Fe', 'Hg'],
    correctAnswer: 'Au'
  },
  {
    questionText: 'Which country is known as the Land of the Rising Sun?',
    options: ['China', 'Japan', 'South Korea', 'Vietnam'],
    correctAnswer: 'Japan'
  },
  {
    questionText: 'Who painted the Mona Lisa?',
    options: [
      'Vincent van Gogh',
      'Pablo Picasso',
      'Leonardo da Vinci',
      'Rembrandt'
    ],
    correctAnswer: 'Leonardo da Vinci'
  },
  {
    questionText: 'What is the largest organ in the human body?',
    options: ['Heart', 'Brain', 'Liver', 'Skin'],
    correctAnswer: 'Skin'
  },
  {
    questionText: 'In which year did Christopher Columbus discover America?',
    options: ['1492', '1607', '1776', '1812'],
    correctAnswer: '1492'
  },
  {
    questionText: 'What is the smallest prime number?',
    options: ['0', '1', '2', '3'],
    correctAnswer: '2'
  },
  {
    questionText:
      'Which gas do plants absorb from the atmosphere during photosynthesis?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
    correctAnswer: 'Carbon Dioxide'
  },
  {
    questionText: 'Who wrote "The Great Gatsby"?',
    options: [
      'F. Scott Fitzgerald',
      'Ernest Hemingway',
      'J.K. Rowling',
      'George Orwell'
    ],
    correctAnswer: 'F. Scott Fitzgerald'
  },
  {
    questionText: 'What is the chemical symbol for water?',
    options: ['H2O', 'CO2', 'O2', 'NaCl'],
    correctAnswer: 'H2O'
  },
  {
    questionText: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Jupiter', 'Saturn', 'Neptune'],
    correctAnswer: 'Jupiter'
  },
  {
    questionText: 'Who is known as the father of modern physics?',
    options: [
      'Albert Einstein',
      'Isaac Newton',
      'Galileo Galilei',
      'Stephen Hawking'
    ],
    correctAnswer: 'Albert Einstein'
  },
  {
    questionText: 'Which continent is the driest and most arid?',
    options: ['Asia', 'Africa', 'Antarctica', 'South America'],
    correctAnswer: 'Antarctica'
  },
  {
    questionText: 'What is the chemical symbol for silver?',
    options: ['Si', 'Ag', 'Al', 'Fe'],
    correctAnswer: 'Ag'
  },
  {
    questionText:
      'Which famous scientist formulated the laws of motion and universal gravitation?',
    options: [
      'Isaac Newton',
      'Albert Einstein',
      'Stephen Hawking',
      'Charles Darwin'
    ],
    correctAnswer: 'Isaac Newton'
  },
  {
    questionText: 'What is the largest ocean in the world?',
    options: [
      'Atlantic Ocean',
      'Indian Ocean',
      'Pacific Ocean',
      'Arctic Ocean'
    ],
    correctAnswer: 'Pacific Ocean'
  }
]

async function insertQuestions() {
  try {
    await Question.deleteMany({})
    await Question.insertMany(questions)

    console.log('Questions added successfully')
  } catch (error) {
    console.error('Error adding questions:', error)
  } finally {
    mongoose.disconnect()
  }
}

insertQuestions()
