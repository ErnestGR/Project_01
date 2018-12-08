
var list = {};

// Playlist API
let API = "https://cors-anywhere.herokuapp.com/http://netcore89.pythonanywhere.com/playlist";


$(document).ready(function () {

    $("#calculate-time").on("click", function () {
        var x = document.getElementById("currentloc");
        function getLocation() {
            if (navigator.geolocation) {
                // Get user location and then generate calculate trip time
                navigator.geolocation.getCurrentPosition(doCalculate);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        // function showPosition(position) {
        function doCalculate(position) {

            var origin = position.coords.latitude + "," + position.coords.longitude;
            var destinationInput = $("#destination-input").val();
            //var genreInput = $("#genres option:selected").val();
            var e = document.getElementById("genres");
            var genreInput = e.options[e.selectedIndex].value;

            console.log("Current Location: " + origin);
            console.log("Destination: " + destinationInput);

            var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + origin + "&destinations=" + destinationInput + "&key=AIzaSyBxR_xcjNZab-IUvUTGn6vYdm9QR6d_ANE";

            // With Origin and Destination, call google.maps and get trip time.
            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function (response) {
                console.log(response);
                var timeValue = response.rows[0].elements[0].duration;
                var duration = timeValue.value;
                var mTrip = Math.floor(duration / 60);
                var sTrip = duration - mTrip * 60;
                if (sTrip < 10) {
                    sTrip = "0" + sTrip;
                }
                console.log("Trip-Time= " + mTrip + ":" + sTrip)
                $("#time").text("Time to arrival " + mTrip + ":" + sTrip);
                $("#currentloc").text("Origin: " + response.origin_addresses);
                var available = duration;
                var selected = [];

                // Call API to list songs by genre (shuffled)
                console.log("Genre: " + genreInput);
                $.ajax({
                    method: "GET",
                      url: API,
                      data: { "cmd": "list",
                              "genre": genreInput,
                            },

                    success: function (data, text) {
                        list = data;
                        console.log("songs:",list);

                        // Process songs list
                        jQuery.each(list, function (i, val) {
                            var minutes = Math.floor(val.duration / 60);
                            var seconds = val.duration - minutes * 60;
                            if (seconds < 10) {
                                seconds = "0" + seconds;
                            }

                            // Check if song fits in available time
                            if (val.duration < available) {
                                available = available - val.duration;

                                selected.push({"artist": val.artist, "name": val.name, "duration": minutes + ":" + seconds});
                            }
                        });

                        var tr;
                        for (var i = 0; i < selected.length; i++) {
                            tr = $('<tr/>');
                            tr.append("<td>" + selected[i].artist + "</td>");
                            tr.append("<td>" + selected[i].name + "</td>");
                            tr.append("<td>" + selected[i].duration + "</td>");

                            $('table').append(tr);
                        }

                        console.log("playlist: " + " " + selected + " ");


                    },
                    error: function (request, status, error) {
                        console.log("Error while getting songs list", error);
                    }
                });

        });
}
        getLocation();
    })
});

$.ajax({

    method: "GET",
      url: API,
      data: { "cmd": "genres"},

    success: function (data, text) {
        list = data;
        console.log(data);
        var arregloUnico = list
        arregloUnico.map((genre) => {
            var option = $("<option>");
            option.text(genre);
            option.attr("value", genre);
            $("#genres").append(option);
        });
        console.log(arregloUnico);
    },
    error: function (request, status, error) {
        console.log("error", error);
    }
});
