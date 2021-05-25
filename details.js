const detailsHeader = document.getElementById("detailsHeader")
const section1 = document.getElementById("section1") // byt namn på sections
const section2 = document.getElementById("section2")
const section3 = document.getElementById("section3")
const section4 = document.getElementById("section4")
const section5 = document.getElementById("section5")
const details = document.getElementById("details")
const detailsWrapper = document.getElementById("detailsWrapper")
const save = document.getElementById("save")

var keysArr = Object.keys(localStorage)
var valsArr = Object.values(localStorage)

$(function () {
    const url = new URLSearchParams(window.location.search)
    var restaurantID = url.get("result")
    showDetails(restaurantID)

    if (localStorage.getItem("logged-in") === "true") {
        save.style.display = "block"
    } else {
        save.style.display = "none"
    }

    if (Object.values(localStorage).includes(restaurantID)) {
        save.innerHTML = "<i class='fas fa-heart'></i>"
    } else {
        save.innerHTML = "<i class='far fa-heart'></i>"
    }

    save.addEventListener("click", function () {
        console.log(valsArr)
        console.log(keysArr)
        if (Object.values(localStorage).includes(restaurantID)) {
            for (var i = 0; i < localStorage.length; i++) {
                if (valsArr[i] == restaurantID) {
                    localStorage.removeItem(`saved${i + 1}`)
                    save.innerHTML = "<i class='far fa-heart'></i>"
                    keysArr = Object.keys(localStorage)
                    valsArr = Object.values(localStorage)
                }
            }
        } else {
            localStorage.setItem(`saved${localStorage.length}`, restaurantID)
            save.innerHTML = "<i class='fas fa-heart'></i>"
            keysArr = Object.keys(localStorage)
            valsArr = Object.values(localStorage)
        }
    })
})

// Checka error och returnera felmeddelande om nödvändigt
function CheckErrorDetails(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json()
    } else {
        // console.log(response.status)

        detailsWrapper.style.display = "none"
        details.innerHTML =
            `<div class='col-12 text-center mt-5'>
                            <h1><i class='fas fa-exclamation'></i></h1>
                        </div>
                        
                        <div class='col-12 text-center'>
                            <h5>Oops! Something went wrong.</i></h5>
                            <p>Server responded with a status of ${response.status} (${response.statusText})</p>
                        </div>`

        throw Error(response.statusText)
    }
}

function showDetails(id) {
    // Get restaurant by ID
    fetch(`https://api.documenu.com/v2/restaurant/${id}`, {
        "method": "GET",
        "headers": {
            "x-api-key": "fd60e6e45b91a1dac542d02a2cb3a0f0"
        }
    })
        .then(CheckErrorDetails)
        .then(data => {
            console.log(data.result)
            let restaurant = data.result

            detailsHeader.innerHTML = restaurant.restaurant_name
            if (restaurant.price_range == "") {
                section1.innerHTML = "Not available"
            } else {
                section1.innerHTML = restaurant.price_range
            }
            if (restaurant.cuisines[0] == "") {
                section2.innerHTML = "Not available"
            } else {
                section2.innerHTML = restaurant.cuisines
            }

            section3.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${restaurant.address.formatted}`
            section4.innerHTML = `<a href="${restaurant.restaurant_website}"><i class="fas fa-laptop"></i> Website</a>`
            if (restaurant.restaurant_phone == "") {
                section5.innerHTML = "<i class='fas fa-phone'></i>  Not available"
            } else {
                section5.innerHTML = `<i class="fas fa-phone"></i> ${restaurant.restaurant_phone}`
            }
        })
        .catch(err => {
            console.error(err)
        })
}