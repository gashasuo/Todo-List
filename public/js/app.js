const uncompletedEl = document.querySelectorAll("span");
const completedListEl = document.querySelector("ul.complete");
const uncompletedListEl = document.querySelector("ul.uncompleted");
const numberCompleteEl = document.querySelector("#complete");

Array.from(uncompletedEl).forEach((element) => {
	element.addEventListener("click", () => {
		let elementID = element.dataset.id;
		//Complete to uncompleted
		if (element.previousElementSibling.classList == "completed") {
			element.previousElementSibling.classList.toggle("completed");
			element.innerText = "☐";
			uncompletedListEl.appendChild(element.parentElement);
			if (element.classList.contains("item")) {
				markIncompleteItems(elementID).then((data) => {
					numberCompleteEl.innerText = `Items left to complete: ${data}`;
				});
			} else if (element.classList.contains("project")) {
				markIncompleteProjects(elementID).then((data) => {
					numberCompleteEl.innerText = `Projects left to complete: ${data}`;
				});
			}
		} //Uncompleted to completed
		else {
			element.previousElementSibling.classList.toggle("completed");
			element.innerText = "✓";
			completedListEl.appendChild(element.parentElement);
			if (element.classList.contains("item")) {
				markCompleteItems(elementID).then((data) => {
					numberCompleteEl.innerText = `Items left to complete: ${data}`;
				});
			} else if (element.classList.contains("project")) {
				markCompleteProjects(elementID).then((data) => {
					numberCompleteEl.innerText = `Projects left to complete: ${data}`;
				});
			}
		}
	});
});

async function markCompleteProjects(elementID) {
	const response = await fetch("/projects/:id/markComplete", {
		method: "put",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			elementID,
		}),
	});
	return await response.json();
}
async function markCompleteItems(elementID) {
	const response = await fetch("/items/:id/markComplete", {
		method: "put",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			elementID,
		}),
	});
	return await response.json();
}

async function markIncompleteProjects(elementID) {
	const response = await fetch("/projects/:id/markIncomplete", {
		method: "put",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			elementID,
		}),
	});
	return await response.json();
}
async function markIncompleteItems(elementID) {
	const response = await fetch("/items/:id/markIncomplete", {
		method: "put",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			elementID,
		}),
	});
	return await response.json();
}
