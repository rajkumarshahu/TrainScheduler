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
  let database = firebase.database();

  let trainName = "";
  let destination = "";
  let startTime = "";
  let frequency = 0;

function currentTime() {
  let current = moment().format('LT');
  $(".current-time").html(`${current}`);
  setTimeout(currentTime, 1000);
};


$("#submit-btn").on("click", e => {
  let timeStr = $("#first-train-input").val().trim();
  let validTimeStr = (timeStr.search(/^\d{2}:\d{2}$/) != -1) &&
            (timeStr.substr(0,2) >= 0 && timeStr.substr(0,2) <= 24) &&
            (timeStr.substr(3,2) >= 0 && timeStr.substr(3,2) <= 59);

  $(".alert-danger").hide();

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
      $("#first-train-input").val().trim() === ""
  ) {
    $(".alert-div").html(`<div class="alert-danger text-center">Some of your inputs are missing!!!</div>`);
    return false;
  } else if(validTimeStr) {
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
    $(".alert-div").html(`<div class="alert-success text-center">Schedule added successfully!!!</div>`);
    return true;
  }else{
    $(".alert-div").html(`<div class="alert-danger text-center">Invalid First Train Time format!!!</div>`);
    return false;
  }
});

// $("#e-submit-btn").on("click", e => {
//   let timeStr = $("#e-first-train-input").val().trim();
//   let valid = (timeStr.search(/^\d{2}:\d{2}$/) != -1) &&
//             (timeStr.substr(0,2) >= 0 && timeStr.substr(0,2) <= 24) &&
//             (timeStr.substr(3,2) >= 0 && timeStr.substr(3,2) <= 59);

//   $(".alert-danger").hide();

//   e.preventDefault();
//   if (
//     $("#e-name-input")
//       .val()
//       .trim() === "" ||
//     $("#e-destination-input")
//       .val()
//       .trim() === "" ||
//     $("#e-frequency-input")
//       .val()
//       .trim() === "" ||
//       $("#e-first-train-input").val().trim() === ""
//   ) {
//     $(".alert-div").html(`<div class="alert-danger p-2 text-center">Some of your inputs are missing!!!</div>`);
//     return false;
//   } else if(valid) {
//     name = $("#e-name-input")
//       .val()
//       .trim();
//     destination = $("#e-destination-input")
//       .val()
//       .trim();
//     firstTrainTime = $("#e-first-train-input")
//       .val()
//       .trim();
//     frequency = $("#e-frequency-input")
//       .val()
//       .trim();

//     refkey = $('#e-key').val().trim();

//     $("#edit-form").hide();

//     database.ref().child(ref-key).update({
//       name: name,
//       destination: destination,
//       firstTrainTime: firstTrainTime,
//       frequency: frequency,
//       dateAdded: firebase.database.ServerValue.TIMESTAMP,
//     });
//     return true;
//   }else{
//     $(".alert-div").html(`<div class="alert-danger p-2 text-center">Invalid train time format!!!</div>`);
//     return false;
//   }
// });

/*database.ref().child('-LkFAn596vtvrq-CPnXo').update({
  name: "Bivek",
  destination: "Toronto",
  firstTrainTime: "21:00",
  frequency: "32",
  dateAdded: firebase.database.ServerValue.TIMESTAMP,
});*/

currentTime();

$(document).on("click", ".remove", function() {
  if(confirm('Are you sure you want to delete this?')){
    console.log($(this));
    keyref = $(this).attr("data-key");
    database.ref().child(keyref).remove();
    mainfunction();
  }
});

// $(document).on('click','.update', function(){
//   //console.log($(this));
//   keyref = $(this).attr("data-key");
//   console.log(keyref);
//   database.ref().once('value',keyref).on("child_added", function(snapshot) {
//     console.log(snapshot.val().name + " :: " + snapshot.val().destination);
//   });
// });

var mainfunction = function () {
  $("tbody").html("");
  database.ref().on("child_added", (snapshot)=> {
    populateTrainSchedule(snapshot);
    });
}

mainfunction();

var populateTrainSchedule = function (snapshot) {
  let newPost = snapshot.val();
    console.log("name: " + newPost.name);
    console.log("desination: " + newPost.destination);
    console.log("Frequency: " + frequency);
    console.log("First train: "+ newPost.firstTrainTime);
    console.log("Key: " + snapshot.key);
    trainName = snapshot.val().name;
    destination = snapshot.val().destination;
    let firstTime = snapshot.val().firstTrainTime;
    let tFrequency = snapshot.val().frequency;
    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    // let currentTime = moment();
    // let currentTimeConverted = moment(currentTime).format("hh:mm");
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    let tRemainder = diffTime % tFrequency;
    let tMinutesTillTrain = tFrequency - tRemainder;
    let nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    // $(".current-time").html(`<div>Current Time: ${currentTimeConverted}</div>`);
    let newRecord =$(`<tr class="arrival"><td>${trainName}</td>
                        <td>${destination}</td>
                        <td class="text-center">${tFrequency}</td>
                        <td class="text-center">${nextTrain}</td>
                        <td class="text-center">${tMinutesTillTrain}</td>
                        <td class="text-center"><button class="remove fa fa-trash-o btn-danger bordered rounded m-1" data-key = ${snapshot.key}></button></td></tr>`);

    $("tbody.data-container").append(newRecord);
}