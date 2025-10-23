// partA/js/main.js
$(document).ready(() => {
  const users = [
    { email: "student1@northeastern.edu", password: "password123" },
    { email: "student2@northeastern.edu", password: "password456" },
  ];

  const validateEmail = (email) => /^[\w.-]+@northeastern\.edu$/i.test(String(email).trim());
  const validatePassword = (pw) => pw.length >= 8;

  const checkFormValidity = () => {
    const email = $("#email").val().trim();
    const pw = $("#password").val().trim();
    if (validateEmail(email) && validatePassword(pw))
      $("#loginBtn").prop("disabled", false);
    else $("#loginBtn").prop("disabled", true);
  };

  $("#email").on("keyup blur", function () {
    const email = $(this).val().trim();
    if (!email || !validateEmail(email))
      $("#emailError").text("Please enter a valid Northeastern email");
    else $("#emailError").text("");
    checkFormValidity();
  });

  $("#password").on("keyup blur", function () {
    const pw = $(this).val().trim();
    if (!pw) $("#passwordError").text("Password cannot be empty");
    else if (pw.length < 8)
      $("#passwordError").text("Password must be at least 8 characters");
    else $("#passwordError").text("");
    checkFormValidity();
  });

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    const email = $("#email").val().trim();
    const pw = $("#password").val().trim();
    const remember = $("#rememberMe").is(":checked");

    const user = users.find((u) => u.email === email && u.password === pw);
    if (!user) {
      $("#loginError").text("Invalid email or password");
      return;
    }

    const username = email.split("@")[0];
    const sessionData = {
      username,
      email,
      timestamp: new Date().toISOString(),
      isLoggedIn: true,
    };

    remember
      ? localStorage.setItem("userSession", JSON.stringify(sessionData))
      : sessionStorage.setItem("userSession", JSON.stringify(sessionData));

    $("#loginError").text("");
    $("#loginSuccess").text("Login successful! Redirecting...").fadeIn();

    setTimeout(() => (window.location.href = "calculator.html"), 2000);
  });

  // Calculator page logic will load only on calculator.html
  if (window.location.pathname.endsWith("calculator.html")) {
    const session = JSON.parse(
      sessionStorage.getItem("userSession") ||
        localStorage.getItem("userSession") ||
        "null"
    );
    if (!session?.isLoggedIn) {
      window.location.href = "index.html";
      return;
    }
    $("#welcomeMsg").text(`Welcome, ${session.username}!`);

    $("#logoutBtn").click(() => {
      sessionStorage.removeItem("userSession");
      localStorage.removeItem("userSession");
      $("body").fadeOut(800, () => (window.location.href = "index.html"));
    });

    const calculate = (num1, num2, op) => {
      switch (op) {
        case "add":
          return num1 + num2;
        case "subtract":
          return num1 - num2;
        case "multiply":
          return num1 * num2;
        case "divide":
          return num2 !== 0 ? num1 / num2 : "Cannot divide by zero";
        default:
          return "Invalid operation";
      }
    };

    $(".op-btn").click(function () {
      const n1 = parseFloat($("#num1").val());
      const n2 = parseFloat($("#num2").val());
      let valid = true;

      if (isNaN(n1)) {
        $("#num1Error").text("Please enter a valid number");
        valid = false;
      } else $("#num1Error").text("");

      if (isNaN(n2)) {
        $("#num2Error").text("Please enter a valid number");
        valid = false;
      } else $("#num2Error").text("");

      if (!valid) return;

      const result = calculate(n1, n2, $(this).data("op"));
      $("#result").val(result).fadeOut(100).fadeIn(100);
    });
  }
});
