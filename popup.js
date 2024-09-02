document.getElementById("searchType").addEventListener("change", updateSearchFields);
document.getElementById("searchButton").addEventListener("click", performSearch);

function updateSearchFields() {
  const searchType = document.getElementById("searchType").value;
  const searchFields = document.getElementById("searchFields");
  searchFields.innerHTML = "";

  if (searchType === "date") {
    searchFields.innerHTML = '<input type="date" id="searchDate">';
  } else if (searchType === "day") {
    searchFields.innerHTML = '<input type="text" id="searchDay" placeholder="e.g., Monday">';
  } else if (searchType === "time") {
    searchFields.innerHTML = '<input type="time" id="startTime"> to <input type="time" id="endTime">';
  } else if (searchType === "topic") {
    searchFields.innerHTML = '<input type="text" id="searchTopic" placeholder="Enter topic">';
  }
}

function performSearch() {
  const searchType = document.getElementById("searchType").value;
  let query = "";
  let startTime = 0;
  let endTime = Date.now();
  let dayFilter = "";

  if (searchType === "date") {
    const date = new Date(document.getElementById("searchDate").value);
    if (isNaN(date)) {
      alert("Please select a valid date.");
      return;
    }
    startTime = date.setHours(0, 0, 0, 0);
    endTime = date.setHours(23, 59, 59, 999);
  } else if (searchType === "day") {
    dayFilter = document.getElementById("searchDay").value.toLowerCase();
    if (!["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].includes(dayFilter)) {
      alert("Please enter a valid day of the week.");
      return;
    }
  } else if (searchType === "time") {
    const start = document.getElementById("startTime").value.split(":");
    const end = document.getElementById("endTime").value.split(":");
    const now = new Date();

    if (start.length === 2 && end.length === 2) {
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), start[0], start[1]).getTime();
      endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), end[0], end[1]).getTime();
    } else {
      alert("Please enter a valid time range.");
      return;
    }
  } else if (searchType === "topic") {
    query = document.getElementById("searchTopic").value.toLowerCase();
    if (!query) {
      alert("Please enter a topic keyword.");
      return;
    }
  }

  chrome.runtime.sendMessage({ action: "searchHistory", searchType, query, startTime, endTime, dayFilter }, (response) => {
    displayResults(response.results);
  });
}

function displayResults(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (results.length === 0) {
    resultsDiv.innerText = "No results found.";
    return;
  }

  results.forEach((item) => {
    const visitDate = new Date(item.lastVisitTime);
    const dateStr = visitDate.toLocaleDateString();
    const timeStr = visitDate.toLocaleTimeString();
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `<b>${dateStr}</b> ${timeStr}<br><a href="${item.url}" target="_blank">${item.title}</a>`;
    resultsDiv.appendChild(resultItem);
  });
}
