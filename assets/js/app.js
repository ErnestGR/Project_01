
var list = {};

$(document).ready(function () {

    $("#calculate-time").on("click", function () {
        var x = document.getElementById("demo");
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {

            var origin = position.coords.latitude + "," + position.coords.longitude;
            var destinationInput = $("#destination-input").val();
            //var genreInput = $("#genres option:selected").val();
            var e = document.getElementById("genres");
            var genreInput = e.options[e.selectedIndex].value;
           
            console.log("Current Location: " + origin);
            console.log("Destination: " + destinationInput);

            var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + origin + "&destinations=" + destinationInput + "&key=AIzaSyBxR_xcjNZab-IUvUTGn6vYdm9QR6d_ANE";

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
                $("#time").text("Time to arrival "  + mTrip + ":" + sTrip);
                var available = duration;
                var selected = "";

                console.log("Genre: " + genreInput);

                jQuery.each(list, function (i, val) {
                    var minutes = Math.floor(val.duration / 60);
                    var seconds = val.duration - minutes * 60;
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    if (val.duration < available && val.genre == genreInput) {

                        available = available - val.duration;
                        selected = selected + val.artist + " - " + val.name + " - " + minutes + ":" + seconds;
                    }
                });
                console.log("playlist: " + " " + selected + " ");
            });
        }
        getLocation();
    })
});

$.ajax({
    method: "GET", url: "http://localhost:8000/servidor.py",
    success: function (data, text) {
        list = data;

        var arregloRepetido = [];
        var options = "<select>";
        jQuery.each(list, function (i, val) {
            arregloRepetido.push(val.genre);
        });
        var arregloUnico = arregloRepetido.filter(function (element, index, self) {
            return index == self.indexOf(element);
        });
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


