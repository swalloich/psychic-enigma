'use strict'

const classificationList = document.getElementById("classification_id");
classificationList.addEventListener("change", handleListChange);
handleListChange(null);

function handleListChange(event) {
    let classification_id = classificationList.value;
    console.log(`classification_id is: ${classification_id}`);
    let classIdURL = `/inv/getInventory/${classification_id}`;
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            console.log(data);
            buildInventoryList(data);
        })
        .catch(function (error) {
            console.error(`There was a problem: ${error.message}`);
        });
}

function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inv-display");
    let dataTable = '<thead>';

    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    dataTable += '<tbody>';

    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';

    inventoryDisplay.innerHTML = dataTable;
}