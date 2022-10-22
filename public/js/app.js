const uncompletedEl = document.querySelectorAll("span");
const completedListEl = document.querySelector("ul.complete");
const uncompletedListEl = document.querySelector("ul.uncompleted");
const numberCompleteEl = document.querySelector("#complete");

Array.from(uncompletedEl).forEach((element) => {
	element.addEventListener("click", () => {
		let elementID = element.dataset.id;
		if (element.previousElementSibling.classList == "completed") {
			element.previousElementSibling.classList.toggle("completed");
			element.innerText = "☐";
			uncompletedListEl.appendChild(element.parentElement);
			markIncomplete(elementID).then((data) => {
				numberCompleteEl.innerText = `Items left to complete: ${data}`;
			});
		} else {
			element.previousElementSibling.classList.toggle("completed");
			element.innerText = "✓";
			completedListEl.appendChild(element.parentElement);
			markComplete(elementID).then((data) => {
				numberCompleteEl.innerText = `Items left to complete: ${data}`;
			});
		}
	});
});

async function markComplete(elementID) {
	const response = await fetch("/items/:id/markComplete", {
		method: "put",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			elementID,
		}),
	});
	return await response.json();
}

async function markIncomplete(elementID) {
	const response = await fetch("/items/:id/markIncomplete", {
		method: "put",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify({
			elementID,
		}),
	});
	return await response.json();
}
