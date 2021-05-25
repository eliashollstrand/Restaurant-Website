function initMap() {
    const location = { lat: 59.440400, lng: 18.063380 }
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: location,
    })
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    })
}

$(function () {
    // localStorage.clear() // Om man vill radera det som finns i localStorage för att "börja om"

    const signUpBtn = document.getElementById("signUpBtn")
    const navbarLinks = document.getElementById("navbarLinks")
    const topRated = document.getElementById("topRatedSection")
    const profileName = document.getElementById("profileName")
    const profileUsername = document.getElementById("profileUsername")
    const profileEmail = document.getElementById("profileEmail")

    const url = new URLSearchParams(window.location.search)
    const username = url.get("username")
    const email = url.get("e-mail")
    const firstname = url.get("firstname")
    const lastname = url.get("lastname")

    if (username != null) {
        localStorage.setItem("username", username)
        localStorage.setItem("firstname", firstname)
        localStorage.setItem("lastname", lastname)
        localStorage.setItem("e-mail", email)
        localStorage.setItem("logged-in", "true")
    }

    // Check if signed in
    if (localStorage.getItem("logged-in") === "true") {
        var userName = localStorage.getItem("username")
        var Email = localStorage.getItem("e-mail")
        var first = localStorage.getItem("firstname")
        var last = localStorage.getItem("lastname")

        console.log("user: " + userName)
        signUpBtn.style.display = "none"

        // Länk i nav
        let userInfo = document.createElement("LI")
        userInfo.innerHTML = `<a href="profile.html" class="nav-link"><strong>${userName}</strong></a>`
        navbarLinks.appendChild(userInfo)

        // Info på profilsidan
        profileUsername.innerHTML = userName
        profileName.innerHTML = first + " " + last
        profileEmail.innerHTML = Email

    }

    // Hämta besökarens position - Då API:et som används inte är lämpat för sverige så fejkas resultatet för "top rated" på sidan, men koden nedan fungerar som den ska
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // console.log(position)

            const KEY = "AIzaSyAb75UMj6lRwcos3UWcredT_t_kNPXHMBQ"
            const LAT = position.coords.latitude
            const LNG = position.coords.longitude

            let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${LAT},${LNG}&key=${KEY}`
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    let parts = data.results[0].address_components
                    let country = null
                    let postal_town = null
                    parts.forEach(part => {
                        if (part.types.includes("country")) {
                            // console.log("User location: " + part.long_name)
                            country = part.long_name
                        }
                    })
                    parts.forEach(part => {
                        if (part.types.includes("postal_town")) {
                            postal_town = part.long_name
                        }
                    })

                    // API:et fungerar endast för restauranger i USA, därmed kommer det inte gå att visa resultat för restauranger i Sverige exempelvis.
                    // Fetchen nedan är endast för demonstrationssyfte. Koden oven fungerar, men i och med att det inte kommer gå att visa resultat utanför USA
                    // så skriver jag inte ut detta ↓.

                    // document.getElementById("topRated").innerHTML = "Top rated in " + postal_town + ", " + country

                    if (window.location.search.includes("search")) {
                        return
                    } else {
                        topRated.style.display = "block"
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }
    else {
        // Om användaren inte tillåter platsdelning
        console.log("geolocation is not supported")
    }

})

// Top rated in New York - för utseendets skull
fetch(`https://api.documenu.com/v2/restaurants/search/fields?state=CA&size=3`, {
    "method": "GET",
    "headers": {
        "x-api-key": "fd60e6e45b91a1dac542d02a2cb3a0f0"
    }
})
    .then(response => response.json())
    .then(data => {
        let restaurants = data.data

        for (var i = 0; i < restaurants.length; i++) {
            let restaurant = restaurants[i]

            let infoCard = document.createElement("div")
            infoCard.classList.add("col-md-4")
            infoCard.classList.add("d-flex")
            infoCard.classList.add("justify-content-center")
            infoCard.innerHTML =

                `<div class="card" style="width: 80%;">
                            <img class="card-img-top" src="https://res.cloudinary.com/tf-lab/image/upload/w_1200,h_674,c_fill,g_auto:subject,q_auto,f_auto/restaurant/b0ffdc3b-923a-4c54-9344-4125f2bf18ea/04d3562c-3cee-4da5-8df8-6524ba3d820d.jpg" alt="${restaurant.restaurant_name}">
                            <div class="card-body">
                                <div id="restaurantName">
                                    <h6 class="card-title"><strong>${restaurant.restaurant_name}</strong></h6>
                                </div>
                                <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${restaurant.address.city}, ${restaurant.address.state}</p>
                                <a id="view" href="details.html?result=${restaurant.restaurant_id}" class="btn btn-primary">View</a>
                            </div>
                        </div>`

            topRatedRow.appendChild(infoCard)
        }

    })
    .catch(err => {
        console.log(err)
    })