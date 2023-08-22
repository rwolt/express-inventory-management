const passwordProtectedForm = document.getElementById("protected-form");
const passwordProtectedFormData = new FormData(passwordProtectedForm);

passwordProtectedForm.addEventListener("click", async (e) => {
  const adminPassword = prompt("Please enter the admin password");
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
      window.location.href = "/shop/items";
    }
  };
});
