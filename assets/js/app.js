// Firebase configuration
let config = {
    apiKey: "AIzaSyBmHotrGNs2RQF1UsTfuNMpmRkPAxzlaxc",
    authDomain: "database-a8975.firebaseapp.com",
    databaseURL: "https://database-a8975.firebaseio.com",
    projectId: "database-a8975",
    storageBucket: "",
    messagingSenderId: "190994548371",
    appId: "1:190994548371:web:83d3fd7afea41bf9"
  };
  // Initialize Firebase
  firebase.initializeApp(config);

  var database = firebase.database();

let trainName = "";
let destination = "";
let startTime = "";
let frequency = 0;
let valid = moment("#first-train-input", "HH:mm", false).isValid();

$("#submit-btn").on("click", e => {
    $(".alert-danger").empty();
  e.preventDefault();
  if (
    $("#name-input")
      .val()
      .trim() === "" ||
    $("#destination-input")
      .val()
      .trim() === "" ||
    $("#frequency-input")
      .val()
      .trim() === "" ||
    $("#first-train-input")
      .val()
      .trim() === ""
  ) {
    $(".alert-danger").html("Some of your inputs are missing!!!");
    return false;
  } else if (valid) {
    $(".alert-danger").html("Please enter time in military format!!!");
    return false;
  } else {
    name = $("#name-input")
      .val()
      .trim();
    destination = $("#destination-input")
      .val()
      .trim();
    firstTrainTime = $("#first-train-input")
      .val()
      .trim();
    frequency = $("#frequency-input")
      .val()
      .trim();

    $(".form-control").val("");

    database.ref().push({
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });
  }
});

database.ref().on("child_added", (snapshot, prevChildKey)=> {
    let newPost = snapshot.val();
    console.log("name: " + newPost.name);
    console.log("desination: " + newPost.destination);
    console.log("Frequency: " + frequency);
    console.log("Previous Post ID: " + prevChildKey);
    let firstTime = snapshot.val().firstTrainTime;
    let tFrequency = snapshot.val().frequency;
    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    let currentTime = moment();
    let currentTimeConverted = moment(currentTime).format("hh:mm");
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    let tRemainder = diffTime % tFrequency;
    let tMinutesTillTrain = tFrequency - tRemainder;
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");

    let newRecord =$(`<tr><td>${snapshot.val().name}</td>
                        <td>${snapshot.val().destination}</td>
                        <td>${tFrequency}</td>
                        <td>${nextTrain}</td>
                        <td>${tMinutesTillTrain}</td></tr>`);

    // newRecord.append($(".train-name").append(snapshot.val().name));
    // newRecord.append($(".destination").append(snapshot.val().destination));
    // newRecord.append($(".frequency").append(snapshot.val().frequency));
    // newRecord.append($(".next-arrival").append(snapshot.val().firstTrainTime));
    // newRecord.append($(".minutes-away").append(snapshot.val().dateAdded));

    $("tbody").append(newRecord);
  });