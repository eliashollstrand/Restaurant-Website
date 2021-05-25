var form = document.querySelector(".needs-validation")

$(function () {
    form.addEventListener("submit", function (event) {
        if (form.checkValidity() === false) {
            console.log("not valid")
            event.preventDefault()
        } else {
            console.log("valid")
        }
        form.classList.add("was-validated")
    })
})