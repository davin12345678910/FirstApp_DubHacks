//Team members: Davin Win Kyi, Aditya.
(function() {
  window.addEventListener('load', init);

  //let currentStudentTopic = "";
  //let currentTeacherTopic = "";

  //let studentBool = false;
  //let teacherBool = false;

  // this is where we will be inializing the behavior of the website
  async function init() {
    // here we will want to initalize addEventListeners
    let startingLearning = document.getElementById('learn-button');
    let startingTeaching = document.getElementById('teach-button');

    //these eventListeners are for when a user wants to
    //start asking a question or if a teacher wants to start finding people
    //that they want to find
    startingLearning.addEventListener('click', startingLearnFunction);
    startingTeaching.addEventListener('click', startingTeachFunction);

    let studentMatchButton = document.getElementById('student-submit-button');
    let teacherMatchButton = document.getElementById('teacher-submit-button');

    studentMatchButton.addEventListener('click', studentMatchesFunction);
    teacherMatchButton.addEventListener('click', teacherMatchesFunction);

    //studentMatchButton.addEventListener('click', outputStudentMatches);
    //teacherMatchButton.addEventListener('click', outputTeacherMatches);

    let studentBackToQuestion = document.getElementById('back-to-student-question');
    let teacherBackToProfile = document.getElementById('back-to-teacher-profile');
    studentBackToQuestion.addEventListener('click', studentBackQuestionFunction);
    teacherBackToProfile.addEventListener('click', teacherBackProfileFunction);

    let backToChooseStudentButton = document.getElementById('back-to-choose-student');
    let backToChooseTeacherButton = document.getElementById('back-to-choose-teacher');

    backToChooseStudentButton.addEventListener('click', backToChooseStudent);
    backToChooseTeacherButton.addEventListener('click', backToChooseTeacher);

    //let urlGetStudentMatches = "/budget/initalize";

    //let studentMatchResults = await fetch(urlGetStudentMatches);
  }

  // Here we will need to insert the items into here
  async function startingLearnFunction() {
    //console.log("I went into here!");
    let startingPage = document.getElementById('sp');
    startingPage.classList.add('hidden');

    let studentPage = document.getElementById('student-profile');
    studentPage.classList.remove('hidden');
  }

  async function startingTeachFunction() {
    //console.log("I went into here!");
    let startingPage = document.getElementById('sp');
    startingPage.classList.add('hidden');

    let teacherPage = document.getElementById('teacher-profile');
    teacherPage.classList.remove('hidden');
  }

//STUDENT MATCHES///////////////////////////////////////////////////////////////

  // You need to find the matches in here
  async function studentMatchesFunction() {


    //here we will try to insert data into the table
    let newForm = new FormData();
    let name = document.getElementById('name').value;
    let topic = document.getElementById('topic').value;
    let question = document.getElementById('question').value;
    let budget = document.getElementById('budget').value;
    newForm.append("name", name);
    newForm.append("topic", topic);
    newForm.append("question", question);
    newForm.append("budget", budget);

    document.getElementById('name').value = "";
    document.getElementById('topic').value = "";
    document.getElementById('question').value = "";
    document.getElementById('budget').value = "";
    let urlInputStudents = "/budget/students";

    let pattern1 = /^([a-zA-Z\s]+)$/;
    let pattern2 = /^([0-9]+)$/;
    let first = pattern1.test(name);
    let second = pattern1.test(topic);
    let third = pattern1.test(question);
    let fourth = pattern2.test(budget);

    if (first && second && third && fourth) {
      let studentPage = document.getElementById('student-profile');
      studentPage.classList.add('hidden');

      let studentMatches = document.getElementById('student-matches');
      studentMatches.classList.remove('hidden');

      console.log("I went into here!");
      // Here we will get the topic returned
      await fetch(urlInputStudents, {method: "POST", body: newForm});

      //console.log("This is the topic result: " + topicResult);

      // Here we will try to get all of the post with the topicResult
      let urlGetStudentMatches = "/budget/teacher?wordsTeacher=" + topic;

      fetch(urlGetStudentMatches)
        .then(studentResults);

      //console.log("These are the results: " + results);
    } else {
      window.alert("Invalid input!");
    }
  }

  async function studentResults(teacherMatchResults) {
    let results = await teacherMatchResults.json();
    console.log(results);

    if (results.teachers.length == 0) {
      console.log("No matches!");
      let noMatches = document.createElement('div');
      let message = document.createElement('p');

      message.textContent = "No matches Found :(";

      noMatches.classList.add('card');

      noMatches.appendChild(message);

      let parent = document.getElementById('student-matches-2');
      parent.appendChild(noMatches);

    // here we will be making the cards.
    } else {
      for(let i = 0; i < results.teachers.length; i++) {
        console.log("HERE!");
        let newCard = document.createElement('div');

        let name = document.createElement('h1');
        name.textContent = "Name: " + results.teachers[i].name;
        let topic = document.createElement('h2');
        topic.textContent = "Topic: " + results.teachers[i].topic;
        let rate = document.createElement('h2');
        rate.textContent = "Rate: " + results.teachers[i].rate;
        let button = document.createElement('button');
        button.textContent = "Message";

        newCard.appendChild(name);
        newCard.appendChild(topic);
        newCard.appendChild(rate);

        // this should be given an event listener, so that you can go
        // to the not finished message area
        newCard.appendChild(button);
        button.classList.add('pill');

        button.addEventListener('click', messagingPlatform2);

        newCard.classList.add('card');

        let parent = document.getElementById('student-matches-2');

        parent.appendChild(newCard);
      }
    }
  }

  function messagingPlatform2() {
    let messagingDiv = document.getElementById('messaging-platform');
    messagingDiv.classList.remove('hidden');

    let teacherForm = document.getElementById('student-matches');
    teacherForm.classList.add('hidden');

    let backButton = document.getElementById('back-to-list');
    backButton.addEventListener('click', backToList);
  }

  function backToList() {
    let messagingDiv = document.getElementById('messaging-platform');
    messagingDiv.classList.add('hidden');

    let teacherForm = document.getElementById('student-matches');
    teacherForm.classList.remove('hidden');

    let messagingPlat = document.getElementById('messaging-platform');
    messagingPlat.classList.add('hidden');
  }

//TEACHER MATCHES///////////////////////////////////////////////////////////////

  async function teacherMatchesFunction() {
    let newForm = new FormData();
    let name = document.getElementById('name2').value;
    let topic = document.getElementById('topic2').value;
    let rate = document.getElementById('rate').value;
    newForm.append("name", name);
    newForm.append("topic", topic);
    newForm.append("rate", rate);

    document.getElementById('name2').value = "";
    document.getElementById('topic2').value = "";
    document.getElementById('rate').value = "";
    let urlInputTeachers = "/budget/teachers";

    console.log("This is the topic: " + topic);

    let pattern1 = /^([a-zA-Z\s]+)$/;
    let pattern2 = /^([0-9]+)$/;
    let first = pattern1.test(name);
    let second = pattern1.test(topic);
    let third = pattern2.test(rate);

    if (first && second && third) {
      let studentPage = document.getElementById('teacher-profile');
      studentPage.classList.add('hidden');

      let studentMatches = document.getElementById('teacher-matches');
      studentMatches.classList.remove('hidden');

      // Here we will get the topicResult
      await fetch(urlInputTeachers, {method: "POST", body: newForm});

      // Here we will try to get all of the post with the topicResult
      let urlGetTeacherMatches = "/budget/student?wordsStudent=" + topic;

      fetch(urlGetTeacherMatches)
        .then(teacherResults);
      //console.log("This is the string: " + results);
      //let parsedResults = JSON.parse(results);
      //console.log("This is the parse: " + parsedResults);
    } else {
      window.alert("Invalid input!");
    }
  }

  async function teacherResults(teacherMatchResults) {
    let results = await teacherMatchResults.json();
    console.log(results);

    if (results.students.length == 0) {
      console.log("No matches!");

      let noMatches = document.createElement('div');
      let message = document.createElement('p');

      noMatches.classList.add('card');

      message.textContent = "No matches Found :(";

      noMatches.appendChild(message);

      let parent = document.getElementById('teacher-matches-2');
      parent.appendChild(noMatches);

    // here we will be making the cards.
    } else {
      for(let i = 0; i < results.students.length; i++) {
        console.log("HERE!");
        let newCard = document.createElement('div');

        let name = document.createElement('h1');
        name.textContent = "Name: " + results.students[i].name;
        let topic = document.createElement('h2');
        topic.textContent = "Topic: " + results.students[i].topic;
        let question = document.createElement('h2');
        question.textContent = "Question: " + results.students[i].question;
        let budget = document.createElement('h2');
        budget.textContent = "Budget: " + results.students[i].budget;
        let button = document.createElement('button');
        button.textContent = "Message";

        newCard.appendChild(name);
        newCard.appendChild(topic);
        newCard.appendChild(question);
        newCard.appendChild(budget);

        // this should be given an event listener, so that you can go
        // to the not finished message area
        newCard.appendChild(button);
        button.classList.add('pill');

        button.addEventListener('click', messagePlatform)

        newCard.classList.add('card');

        let parent = document.getElementById('teacher-matches-2');

        parent.appendChild(newCard);
      }
    }

    // else we will append the needed nodes
  }

  function messagePlatform() {
    let messagingDiv = document.getElementById('messaging-platform');
    messagingDiv.classList.remove('hidden');

    let teacherForm = document.getElementById('teacher-matches-2');
    teacherForm.classList.add('hidden');

    let backButton = document.getElementById('back-to-list');
    backButton.addEventListener('click', backToList2);
  }

  function backToList2() {
    let messagingDiv = document.getElementById('messaging-platform');
    messagingDiv.classList.add('hidden');

    let teacherForm = document.getElementById('teacher-matches-2');
    teacherForm.classList.remove('hidden');

    let messagingPlat = document.getElementById('messaging-platform');
    messagingPlat.classList.add('hidden');
  }

////////////////////////////////////////////////////////////////////////////////////


  // these are the bacl button functions
  function studentBackQuestionFunction() {
    let studentPage = document.getElementById('student-profile');
    studentPage.classList.remove('hidden');

    let studentMatches = document.getElementById('student-matches');
    studentMatches.classList.add('hidden');

    let allElements = document.getElementsByClassName('card');

    while(allElements.length > 0){
      allElements[0].parentNode.removeChild(allElements[0]);
    }
  }

  function teacherBackProfileFunction() {
    let studentPage = document.getElementById('teacher-profile');
    studentPage.classList.remove('hidden');

    let studentMatches = document.getElementById('teacher-matches');
    studentMatches.classList.add('hidden');

    let allElements = document.getElementsByClassName('card');

    while(allElements.length > 0){
      allElements[0].parentNode.removeChild(allElements[0]);
    }
  }

  // If any of these buttons are pressed on, we will need to
  // refresh remove all of the children that have a certain
  // class associated with it

  function backToChooseStudent() {
    let allElements = document.getElementsByClassName('card');
    while(allElements.length > 0){
      allElements[0].parentNode.removeChild(allElements[0]);
    }
    let studentPage = document.getElementById('student-profile');
    studentPage.classList.add('hidden');

    let studentMatches = document.getElementById('sp');
    studentMatches.classList.remove('hidden');

    document.getElementById('name').value = "";
    document.getElementById('topic').value = "";
    document.getElementById('question').value = "";
    document.getElementById('budget').value = "";
  }

  function backToChooseTeacher() {
    let allElements = document.getElementsByClassName('card');
    while(allElements.length > 0){
      allElements[0].parentNode.removeChild(allElements[0]);
    }
    let studentPage = document.getElementById('teacher-profile');
    studentPage.classList.add('hidden');

    let studentMatches = document.getElementById('sp');
    studentMatches.classList.remove('hidden');

    document.getElementById('name2').value = "";
    document.getElementById('topic2').value = "";
    document.getElementById('rate').value = "";
  }

  // this will be a function we will use to get components from the html file
  function id(id) {
    return document.getElementById(id);
  }
})();

