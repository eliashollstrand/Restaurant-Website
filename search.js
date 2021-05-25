// iCloud key: 4eed8a5bc3mshdc4b836c9153acap17ff6ajsncf32cba81022
// Google key: 78a1ed8e0amsh5c0ae917296bacbp1ccce0jsn237c86736bde

// Måste ha rapidapi key också!
// Documenu: ae576019b61f75cf8da74693facceb79 icloud ---
// Documenu: 85d2a798f20ba2901c777d5c2a7abfe8 photo
// Documenu: 2f146cd012c7686eba09fecf0215a24b skola på rapid - måste logga in med icloud på docu
// Documeny: 6c8e526c7b4e8edb84e0b19b3f021ed1


const results = document.getElementById("results")
const resultsHeader = document.getElementById("resultsHeader")
const resultsHero = document.getElementById("resultsHero")
const topRatedSection = document.getElementById("topRatedSection")

var states = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "district of columbia", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire", "new jersey", "new mexico", "new york", "north carolina", "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming"
]

var stateCodes =
    [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ]

$(function () {
    if (window.location.search.includes("search")) {
        const url = new URLSearchParams(window.location.search)
        var searchTerm = url.get("search")

        resultsHeader.scrollIntoView()
        console.log("searched for: " + searchTerm)
        topRatedSection.style.display = "none"
        resultsHeader.innerHTML = `Showing results for "${searchTerm}"`

        for (var i = 0; i < states.length; i++) {
            if (searchTerm.toLowerCase() === states[i]) {
                state(stateCodes[i]) // Söker efter resultat med avseende på stat
            }
        }

        restaurantName(searchTerm) // Söker efter resultat med avseende på restaurangers namn
    }
})

// Checka error och returnera felmeddelande om nödvändigt
function CheckError(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json()
    } else {
        resultsHeader.style.display = "none"
        results.innerHTML =
            `<div class='col-12 text-center'>
                            <h1><i class='fas fa-exclamation'></i></h1>
                        </div>
                        
                        <div class='col-12 text-center'>
                            <h5>Oops! Something went wrong.</i></h5>
                            <p>Server responded with a status of ${response.status} (${response.statusText})</p>
                        </div>`

        throw Error(response.statusText)
    }
}

// Search by US state (state code)
function state(state) {
    fetch(`https://api.documenu.com/v2/restaurants/search/fields?state=${state}&size=20`, {
        "method": "GET",
        "headers": {
            "x-api-key": "fd60e6e45b91a1dac542d02a2cb3a0f0"
        }
    })

        .then(CheckError)
        .then(data => {
            let restaurants = data.data
            console.log(restaurants)

            for (var i = 0; i < restaurants.length; i++) {
                let restaurant = restaurants[i]

                let infoCard = document.createElement("div")
                infoCard.classList.add('col-lg-3')
                infoCard.classList.add('col-md-4')
                infoCard.style.marginTop = "20px"
                infoCard.style.marginBottom = "20px"
                infoCard.innerHTML =

                    `<div class="card">
                            <img class="card-img-top" src="https://res.cloudinary.com/tf-lab/image/upload/w_1200,h_674,c_fill,g_auto:subject,q_auto,f_auto/restaurant/b0ffdc3b-923a-4c54-9344-4125f2bf18ea/04d3562c-3cee-4da5-8df8-6524ba3d820d.jpg" alt="${restaurant.restaurant_name}">
                                <div class="card-body">
                                    <div id="restaurantName">
                                        <h6 class="card-title"><strong>${restaurant.restaurant_name}</strong></h6>
                                    </div>
                                    <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${restaurant.address.city}, ${restaurant.address.state}</p>
                                    <a id="view" href="details.html?result=${restaurant.restaurant_id}" class="btn btn-primary">View</a> 
                                </div>
                            </div>`

                results.appendChild(infoCard)
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// Search by restaurant name
function restaurantName(restaurantName) {
    fetch(`https://api.documenu.com/v2/restaurants/search/fields?restaurant_name=${restaurantName}&size=20`, {
        "method": "GET",
        "headers": {
            "x-api-key": "fd60e6e45b91a1dac542d02a2cb3a0f0"
        }
    })
        .then(CheckError)
        .then(data => {
            let restaurants = data.data

            for (var i = 0; i < restaurants.length; i++) {
                let restaurant = restaurants[i]

                let infoCard = document.createElement("div")
                infoCard.classList.add('col-lg-3')
                infoCard.classList.add('col-md-4')
                infoCard.style.marginTop = "20px"
                infoCard.style.marginBottom = "20px"
                infoCard.innerHTML =

                    `<div class="card">
                            <img class="card-img-top" src="https://res.cloudinary.com/tf-lab/image/upload/w_1200,h_674,c_fill,g_auto:subject,q_auto,f_auto/restaurant/b0ffdc3b-923a-4c54-9344-4125f2bf18ea/04d3562c-3cee-4da5-8df8-6524ba3d820d.jpg" alt="${restaurant.restaurant_name}">
                                <div class="card-body">
                                    <div id="restaurantName">
                                        <h6 class="card-title"><strong>${restaurant.restaurant_name}</strong></h6>
                                    </div>
                                    <p class="card-text"><i class="fas fa-map-marker-alt"></i> ${restaurant.address.city}, ${restaurant.address.state}</p>
                                    <a id="view" href="details.html?result=${restaurant.restaurant_id}" class="btn btn-primary">View</a>
                                </div>
                            </div>`

                results.appendChild(infoCard)
            }

        })
        .catch(err => {
            console.log(err)
        })
}
