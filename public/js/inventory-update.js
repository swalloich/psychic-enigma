const form = document.querySelector('#updateForm');
form.addEventListener("change", () => {
    const updateBtn = document.querySelector("#update-btn");
    updateBtn.removeAttribute("disabled");
});