const allSpansEl = document.querySelectorAll("span");
const completedListEl = document.querySelector("ul.complete");
const uncompletedListEl = document.querySelector("ul.uncompleted");
const numberCompleteEl = document.querySelector("#complete");
const markAllCompleteEL = document.querySelector("#markAll");

function numberLefttoComplete(element, elementID, status) {
	if (element.classList.contains("item") && !(status == markComplete)) {
		markIncompleteItems(elementID).then((data) => {
			return (numberCompleteEl.innerText = `Items left to complete: ${data}`);
		});
	} else if (element.classList.contains("item") && status == markComplete) {
		markCompleteItems(elementID).then((data) => {
			return (numberCompleteEl.innerText = `Items left to complete: ${data}`);
		});
	} else if (
		element.classList.contains("project") & !(status == markComplete)
	) {
		markIncompleteProjects(elementID).then((data) => {
			return (numberCompleteEl.innerText = `Projects left to complete: ${data}`);
		});
	} else if (element.classList.contains("project") && status == markComplete) {
		markIncompleteProjects(elementID).then((data) => {
			return (numberCompleteEl.innerText = `Projects left to complete: ${data}`);
		});
	}
}

Array.from(allSpansEl).forEach((element) => {
	element.addEventListener("click", () => {
		let elementID = element.dataset.id;
		if (!(element.previousElementSibling.classList == "completed")) {
			element.previousElementSibling.classList.toggle("completed");
			element.innerText = "✓";
			completedListEl.appendChild(element.parentElement);
			let status = markComplete;
			numberLefttoComplete(element, elementID, status);
		} else {
			element.previousElementSibling.classList.toggle("completed");
			element.innerText = "☐";
			uncompletedListEl.appendChild(element.parentElement);
			let status = markIncomplete;
			numberLefttoComplete(element, elementID, status);
		}
	});
});

//mark all complete in project
if (markAllCompleteEL) {
	markAllCompleteEL.addEventListener("click", (e) => {
		console.log(e);
		let elementID = e.currentTarget.dataset.id;
		console.log(e.currentTarget.dataset.id);
		markAllItemsComplete(elementID).then((data) => {
			Array.from(uncompletedEl).forEach((element) => {
				if (!(element.previousElementSibling.classList == "completed")) {
					element.previousElementSibling.classList.toggle("completed");
					element.innerText = "✓";
					completedListEl.appendChild(element.parentElement);
				}
			});
		});
	});
}

async function markAllItemsComplete(elementID) {
	const response = await fetch("/projects/:id/markAllitemsComplete", {
		method: "put",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			elementID,
		}),
	});
	return await response.json();
}

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
