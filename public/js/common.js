$(document).ready(function () {
    document.getElementById("defaultOpen").click();

    $.ajax({
        url: '/src/V1/controller/getLocation.php',
    });

    $.ajax({
        url: '/src/V1/controller/getAddress.php',
        type: 'POST',
        data: '',
        success: function (result,status,xhr) {

            if (status == 'success') {
                var data = JSON.parse(result);
                var length = data.data.length;

                for (var i = 0; i < length ; i++) {
                    $('#from_address').append("<option value='" + data.data[i].id + "'>" + data.data[i].name  +"</option>");
                    $('#to_address').append("<option value='" + data.data[i].id + "'>" + data.data[i].name  +"</option>");
                }
            }
        },
        error: function (xhr,status,error) {
            
        }
    });
    
    $('#btnFindPath').click(function () {
        var from = $('#from_address').val();
        var to = $('#to_address').val();

        $.ajax({
            url: '/src/V1/controller/findPath.php',
            type: 'POST',
            data: {
                from: from,
                to: to
            },
            success: function (result, status, xhr) {
                if (status == 'success') {
                    var data = (JSON.parse(result)).data;
                    var length = data.length;
                    var flightPlanCoordinates = [];
                    var fistPosition = null;

                    for (var i = 0; i < length ; i++) {
                        var location = {
                            lat: parseFloat(data[i].latitude),
                            lng: parseFloat(data[i].longitude)
                        };

                        if (fistPosition == null) {
                            fistPosition = location;
                        }

                        flightPlanCoordinates.push(location);
                    }

                    flightPath.setMap(null);
                    flightPath.setPath(flightPlanCoordinates);
                    flightPath.setMap(map);

                    clearMaker();
                    var start = new google.maps.Marker({
                        position: fistPosition,
                        map: map,
                        icon: '/public/assets/images/pin.png'
                    });

                    var end = new google.maps.Marker({
                        position: location,
                        map: map
                    });

                    markers.push(start);
                    markers.push(end);
                }
            },
            error: function (xhr, status, error) {

            }
        });
    });
});

function openTabs(evt, name) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
}