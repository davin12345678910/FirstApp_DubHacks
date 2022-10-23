const express = require('express');
const app = express();

// For multer:
const multer = require("multer");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module


/**
 * This is needed in order to run our sql statements that
 * will allow us to update our database
 */
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let initalizeDB = false;

// this is for the student information
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "budgets.db",
    driver: sqlite3.Database
  });
  return db;
}

app.get('/budget/initalize', async(req,res) => {
  // here we will want to insert the two tables
  let db = await getDBConnection();
   await db.run("CREATE TABLE S(name TEXT, topic TEXT, question TEXT, budget TEXT)");

   await db.run("CREATE TABLE T(name TEXT, topic TEXT, rate TEXT)");

  res.type('text').send("Made tables!");

  console.log("TABLES HAVE BEEN CREATED!");
});


//THIS IS FOR THE STUDENT TRACK///////////////////////////////////////////////////

// here we will be able to insert student information into the
// student database
app.post('/budget/students', async (req,res) => {
  let studentDB = await getDBConnection();

  let name = "" + req.body.name;
  let topic = "" + req.body.topic;
  let question = "" + req.body.question;
  let budget = "" + req.body.budget;
  console.log("name: " + name);
  console.log("topic: " + topic);
  console.log("question: " + question);
  console.log("budget: " + budget);

  // here we will need to check if any of them are undefined
  if(name == undefined || topic == undefined
    || question == undefined || budget == undefined) {
      res.type('text').send("Missing parameters!");
   } else {
    let addPost = "INSERT INTO S(name, topic, question, budget) " +
    "VALUES(?,?,?,?);";

    console.log("This is addPost: " + addPost);

    await studentDB.run(addPost,[name, topic, question, budget]);

    res.type('text').send("" + topic);
   }
});

// here we will be able to get teacher information from the database
// and find matching teachers
app.get('/budget/teacher', async (req, res) => {
  console.log("I went into here! (MATCHING TEACHERS)");
  let teacherDB = await getDBConnection();

  let keyWord = req.query.wordsTeacher;
  console.log("keyword: " + keyWord);

  if (keyWord == undefined) {
    res.type('text').send("No query parameters given!");
  } else {
    console.log("This is the keyword: " + keyWord);
    let queryGetAll = "SELECT name, topic, rate" +
    " FROM T WHERE topic like '%" + keyWord + "%';";

    console.log("This is the query: " + queryGetAll);

    let matchingTeachers = await teacherDB.all(queryGetAll);

    console.log("These are the matching teachers: " + matchingTeachers);

    let matchTeachResults = new Object();
    matchTeachResults.teachers = matchingTeachers;

    let finalObject = JSON.stringify(matchTeachResults)

    res.type('json').send(finalObject);

    console.log(finalObject)
  }
});

//THIS IS FOR THE Teacher TRACK//////////////////////////////////////////////////

// here we will be able to insert teacher information into the
// student database
app.post('/budget/teachers', async (req,res) => {
  let teacherDB = await getDBConnection();

  let name = req.body.name;
  let topic = req.body.topic;
  let rate = req.body.rate;

  // here we will need to check if any of them are undefined
  if(name == undefined || topic == undefined
   || rate == undefined) {
      res.type('text').send("Missing parameters!");
   } else {
    let addPost = "INSERT INTO T(name, topic, rate) " +
    "VALUES(?,?,?);";

    console.log("This is addPost: " + addPost);

    await teacherDB.run(addPost, [name, topic, rate]);

    res.type('text').send("" + topic);
   }
});

// here we will be able to get teacher information from the database
// and find matching teachers
app.get('/budget/student', async (req, res) => {
  console.log("I went into here! (TEACHERS)");
  let teacherDB = await getDBConnection();

  let keyWord = req.query.wordsStudent;

  if (keyWord == undefined) {
    res.type('text').send("No query parameters given!");
  } else {
    console.log("This is the keyword: " + keyWord);
    let queryGetAll = "SELECT name, topic, question, budget" +
    " FROM S WHERE topic like '%" + keyWord + "%';";

    console.log("This is the query: " + queryGetAll);

    let matchingStudents = await teacherDB.all(queryGetAll);

    console.log("These are the matching students: " + matchingStudents);

    let matchStudentResults = new Object();
    matchStudentResults.students = matchingStudents;

    let finalObject = JSON.stringify(matchStudentResults)

    console.log(finalObject)

    res.type('json').send(finalObject);
  }
});




//you will need this for the ports
app.use(express.static('public'));

const DEFAULT_PORT = 8000;

const PORT = process.env.PORT || DEFAULT_PORT;

app.listen(PORT);