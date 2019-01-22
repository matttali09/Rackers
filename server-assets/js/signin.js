// shorthand for doc.ready
$(function () {
    // sidnav control
    $(".sidenav").sidenav();
    // Getting references to our submit button inputs
    var loginButton = $("#submit");
    var updateButton = $("#update");
    var nameInput = $("#name");
    var passwordInput = $("#password");
    var ageInput = $("#age");

    // When the input is submitted, we validate there's an name and age entered
    loginButton.on("click", function (event) {
        console.log("loggin button pressed");

        event.preventDefault();
        var userData = {
            name: nameInput.val().trim(),
            password: passwordInput.val().trim()
        };

        if (!userData.password) {
            return;
        };
        if (!userData.name) {
            userData.name = "Anonymous";
        };

        // If we have an email and age we run the loginUser function and clear the input areas
        loginUser(userData.name, userData.password);
        nameInput.val("");
        passwordInput.val("");
    });

    // loginUser does a post to our "api/signin" route and if successful, redirects us the the home page
    function loginUser(name, password) {
        $.post("/api/signin", {
            name: name,
            password: password
        }).then(function (data) {
            window.location.replace(data);
            // If there's an error, log the error
        }).catch(function (err) {
            console.log(err);
        });
    };

    // When the input is submitted, we validate there's an name and age entered
    updateButton.on("click", function (event) {
        event.preventDefault();

        // search through users and if name and age are the same
        $.get("/api/users:", req.user.id, function (data) {
            console.log("user", data);
        });

        var userData = {
            name: nameInput.val().trim().replace(/\s+/g, '-').toLowerCase(),
            age: ageInput.val().trim(),
        };

        // If we have an email and age we run the loginUser function and clear the input areas
        updateUser(userData.name, userData.age);
        nameInput.val("");
        ageInput.val("");
    });

    // updateUser does a put to our "api/users" route and if successful, redirects us the the home page
    function updateUser(name, age) {
        $.put("/api/users", {
            name: name,
            age: age,
            newLat: myLat,
            newLong: myLong
        }).then(function (data) {
            window.location.replace(data);
            // If there's an error, log the error
        }).catch(function (err) {
            console.log(err);
        });
    };

});
