const passwordProtectedForm = document.getElementById("protected-form");
const formSubmitButton = document.getElementById("submit-button");
const currentUrl = window.location.href;

// Create a custom modal for password input
const modal = document.createElement("div");
modal.classList.add("modal");
modal.classList.add("hidden");
const passwordPrompt = document.createElement("p");
const promptText = document.createTextNode("Please enter the admin password");
passwordPrompt.appendChild(promptText);
const passwordInput = document.createElement("input");
passwordInput.type = "password";
const promptSubmitButton = document.createElement("button");
const buttonText = document.createTextNode("Submit");
promptSubmitButton.appendChild(buttonText);
modal.appendChild(passwordPrompt);
modal.appendChild(passwordInput);
modal.appendChild(promptSubmitButton);
document.body.appendChild(modal);

// Show or hide the password prompt on when submitting the form
formSubmitButton.addEventListener("click", (e) => {
  modal.classList.toggle("hidden");
});

// Event listener for the password prompt submit
promptSubmitButton.addEventListener("click", async (e) => {
  modal.classList.toggle("hidden");
  const adminPassword = passwordInput.value;
  const passwordProtectedFormData = new FormData(passwordProtectedForm);
  passwordProtectedFormData.append("adminPassword", adminPassword);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "");
  xhr.send(passwordProtectedFormData);
  xhr.onload = () => {
    let status = xhr.status;
    if (status == 500) {
      xhr.abort();
      alert("Incorrect password");
      window.location.reload();
    } else {
      xhr.abort();
      if (currentUrl.toString().includes("item")) {
        window.location.href = "/shop/items";
      } else {
        window.location.href = "/shop/categories";
      }
    }
  };
});
