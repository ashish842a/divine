const signupBtn = document.querySelector(".signupBtn");
const loginBtn = document.querySelector(".loginBtn");
const moveBtn = document.querySelector(".moveBtn");
const signup = document.querySelector(".signup");
const login = document.querySelector(".login");

loginBtn.addEventListener("click", function () {
  moveBtn.classList.add("rightbtn");
  login.classList.add("loginform");
  signup.classList.remove("signupform");
  moveBtn.innerHTML = "Login";
});

signupBtn.addEventListener("click", function () {
  moveBtn.classList.remove("rightbtn");
  login.classList.remove("loginform");
  signup.classList.add("signupform");
  moveBtn.innerHTML = "signup";
});
