const passwordProtectedForm = document.getElementById("protected-form");
const submitButton = document.getElementById("submit-button");
const url = window.location.href;

submitButton.addEventListener("click", async (e) => {
  const adminPassword = prompt("Please enter the admin password");
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
      if (url.toString().includes("item")) {
        window.location.href = "/shop/items";
      } else {
        window.location.href = "/shop/categories";
      }
    }
  };
});
