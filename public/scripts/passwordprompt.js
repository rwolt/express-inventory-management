const deleteForm = document.getElementById("delete-form");
const deleteFormData = new FormData(deleteForm);
const itemId = deleteFormData.get("itemId");

deleteForm.addEventListener("click", async (e) => {
  const adminPassword = prompt("Please enter the admin password");
  deleteFormData.append("adminPassword", adminPassword);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "");
  xhr.send(deleteFormData);
  xhr.onload = () => {
    let status = xhr.status;
    if ((status = 200)) {
      window.location.href = "/shop/items";
    }
  };
});
