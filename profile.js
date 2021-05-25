const savedRestaurants = document.getElementById("savedRestaurants")
const savedRestaurantsWrapper = document.getElementById("savedRestaurantsWrapper")

var keysArr = Object.keys(localStorage)
var valsArr = Object.values(localStorage)
var hasSaved = false

// Checka error och returnera felmeddelande om nödvändigt
function CheckError3(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json()
    } else {
        // console.log(response.status)

        savedRestaurants.style.display = "none"
        savedRestaurantsWrapper.innerHTML = "There was a problem finding your saved restaurants."

        throw Error(response.statusText)
    }
}

function removeSaved(id) {
    var targeted = document.getElementById(id)

    for(var i = 0; i < valsArr.length; i++) {
        if(valsArr[i] == id) {
            savedNr = keysArr[i]
            localStorage.removeItem(savedNr)
            targeted.remove()
        }
        if(savedRestaurants.hasChildNodes() === false) {
            let infoCard = document.createElement("div")
                infoCard.classList.add('col-sm-12')
                infoCard.innerHTML = "You have no saved restaurants"

                savedRestaurants.appendChild(infoCard)
        }
    }
}

$(function() { 
    console.log(keysArr) 
    for(var i = 0; i < keysArr.length; i++) {
        if(keysArr[i].includes("saved")) {
            hasSaved = true
            console.log(valsArr[i])
            var restaurantID = valsArr[i]

            fetch(`https://api.documenu.com/v2/restaurant/${restaurantID}`, {
                "method": "GET",
                "headers": {
                    "x-api-key": "fd60e6e45b91a1dac542d02a2cb3a0f0"
                }
                })
                .then(CheckError3) // --- checka error och visa meddelande att "sparade inte kunde hämtas"
                    .then(data => {
                        console.log(data.result)
                        let restaurant = data.result

                        let infoCard = document.createElement("div")
                            infoCard.classList.add('col-lg-4')
                            infoCard.classList.add('col-md-6')
                            infoCard.id = restaurant.restaurant_id
                            infoCard.innerHTML = 
                                
                                `<div class="card">
                                    <img class="card-img-top" src="https://res.cloudinary.com/tf-lab/image/upload/w_1200,h_674,c_fill,g_auto:subject,q_auto,f_auto/restaurant/b0ffdc3b-923a-4c54-9344-4125f2bf18ea/04d3562c-3cee-4da5-8df8-6524ba3d820d.jpg" alt="${restaurant.restaurant_name}">
                                    <div class="card-body">
                                        <h6 class="card-title" style="height: 20px; margin-bottom: 35px; font-size: 15px;"><strong>${restaurant.restaurant_name}</strong></h6>
                                        <a id="view" href="details.html?result=${restaurant.restaurant_id}" class="btn btn-primary mt-1">View</a> 
                                        <button id="${restaurant.restaurant_id}"class="btn btn-primary remove mt-1" onclick="removeSaved(${restaurant.restaurant_id})">Remove</i></button>
                                    </div>
                                </div>`

                        savedRestaurants.appendChild(infoCard)
                    })
                .catch(err => {
                    console.error(err)
                })

        }
    }

    if(hasSaved === false) {
        console.log("no restaurants saved")
        let infoCard = document.createElement("div")
            infoCard.classList.add('col-sm-12')
            infoCard.innerHTML = "You have no saved restaurants"

        savedRestaurants.appendChild(infoCard)
    }
})