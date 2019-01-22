
$(document).ready(function () {
    // sidnav control
    $(".sidenav").sidenav();
    // Getting references to our form and input
    var signUpForm = $("#createU");
    var passwordInput = $("#password")
    var nameInput = $("#name");
    var ageInput = $("#age");

    // When the signup button is clicked, we validate the name and age are not blank
    signUpForm.on("click", function (event) {
        console.log("create user button pressed")
        event.preventDefault();
        var userData = {
            name: nameInput.val().trim().replace(/\s+/g, '-').toLowerCase(),
            password: passwordInput.val().trim(),
            age: ageInput.val().trim()
        };
        if (!userData.name) {
            userData.name = "Anonymous";
        };

        if (!userData.age || !passwordInput) {
            return;
        };

        // If we have an name and age, run the signUpUser function
        signUpUser(userData.name, userData.password, userData.age);
        nameInput.val("");
        passwordInput.val("");
        ageInput.val("");
    });

    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser(name, password, age) {
        $.post("/api/signup", {
            name: name,
            password: password,
            age: age,
        }).then(function (data) {
            console.log("this ran1")
            window.location.replace(data);
            // If there's an error, handle it by throwing up a bootstrap alert
        }).catch(function (err) {
            console.log(err);
        });
    }

});