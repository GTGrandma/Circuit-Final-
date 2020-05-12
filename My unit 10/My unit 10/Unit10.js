// Map Function
$("#maplist").on("click", function () {
  $("#map").removeClass(display);
});

function initMap() {
  // The location of Monk's
  var location = { lat: 40.8054491, lng: -73.9654415 };
  // The map, centered at Monk's
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: location,
  });
  // The marker, positioned at Monk's
  var marker = new google.maps.Marker({ position: location, map: map });
}

$("#imageList").on("click", function () {
  $("#custImages").toggle();
});

$("#mapList").on("click", function () {
  $("#map").toggle();
});

$("#reviewList").on("click", function () {
  $("#custReviews").toggle();
});

imageList;

var images = [
  "https://media.istockphoto.com/photos/breakfast-with-bacon-eggs-pancakes-and-toast-picture-id533645537?k=6&m=533645537&s=612x612&w=0&h=iccHuYLLyNyO_Ok84RKBB-pHEc-sPiS6zC_IMlch-QA=",
  "https://upload.wikimedia.org/wikipedia/commons/9/94/Salad_platter.jpg",
  "https://images.squarespace-cdn.com/content/v1/59921b7c49fc2bb221527a7e/1508876111268-9TPY7I5PT8JHEYHSJ4NB/ke17ZwdGBToddI8pDm48kFWxnDtCdRm2WA9rXcwtIYR7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UcTSrQkGwCGRqSxozz07hWZrYGYYH8sg4qn8Lpf9k1pYMHPsat2_S1jaQY3SwdyaXg/supper+-+25.jpg?format=2500w",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSv-QNZe_ie7LlNx26VEvl_nbGLmcFlOJnADtowqs_U9YkpN7cK&usqp=CAU",
  "https://m.media-amazon.com/images/M/MV5BZWNkNGNkMGYtOTYxNy00Mzc1LWE0ZDctOTEwNmJhYjZmM2YzXkEyXkFqcGdeQXVyNjkwNzgzNTQ@._V1_.jpg",
];
var currentPosition = 0;
$("#next").on("click", function () {
  // Update the current position
  currentPosition += 1;

  // Update source
  changeImage();

  //Make sure the previous button is enabled
  $("#prev").prop("disabled", false);

  // If the currentPosition is at the last image
  if (currentPosition === images.length - 1) {
    // Disable the next button
    $("#next").prop("disabled", true);
  }
});
$("#prev").on("click", function () {
  // Update the current position
  currentPosition -= 1;

  // Update source
  changeImage();

  // Make sure the next button is enabled
  $("#next").prop("disabled", false);

  // If the currentPosition is at the first item (the zero index), disable the previous button
  if (currentPosition === 0) {
    $("#prev").prop("disabled", true);
  }
});
function changeImage() {
  // Update the src attribute to the urls that's stored at the currentPosition in the array
  $("#currentImage").attr("src", images[currentPosition]);
}

// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyCiO-TbQiBlXrmICZrzhJb8g40CXlD66G4",
  authDomain: "reservation-site-a87ef.firebaseapp.com",
  databaseURL: "https://reservation-site-a87ef.firebaseio.com",
  projectId: "reservation-site-a87ef",
  storageBucket: "reservation-site-a87ef.appspot.com",
};

// Initialize Firebase
firebase.initializeApp(config);

var database = firebase.database();
//The system forced me to change firebaseConfig to "config" in the variable and the initialization

//creating empty object for user input
var reservationData = {};

// set the day when an option is clicked on
$("#reservation-day a").on("click", function () {
  reservationData.day = $(this).text();
});

// when submitted, the name data should be set
// and all data should be sent to your database
$(".reservation-form").on("submit", function (event) {
  event.preventDefault();

  reservationData.name = $("#reservation-name").val();

  // create a section for reservations data in your db
  var reservationsReference = database.ref("reservations");
  console.log(reservationData);
  reservationsReference.push(reservationData);
  $("#reservation-name").val("");

  reservationData = {};
});

// retrieve reservations data when page loads and when reservations are added
function getReservations() {
  // use reference to database to listen for changes in reservations data
  database.ref("reservations").on("value", function (results) {
    // Get all reservations stored in the results we received back from Firebase
    var allReservations = results.val();

    // remove all list reservations from DOM before appending list reservations
    $(".reservation-list").empty();

    // iterate (loop) through all reservations coming from database call
    for (var reservation in allReservations) {
      // Create an object literal with the data we'll pass to Handlebars
      var context = {
        name: allReservations[reservation].name,
        day: allReservations[reservation].day,
        reservationId: reservation,
      };

      var source = $("#reservation-template").html();

      var template = Handlebars.compile(source);

      var reservationListItem = template(context);

      $(".reservation-list").append(reservationListItem);
    }
  });
}
// When page loads, get reservations
getReservations();
