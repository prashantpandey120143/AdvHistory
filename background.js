chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "searchHistory") {
      let query = {
        text: request.query || "",
        startTime: request.startTime || 0,
        endTime: request.endTime || Date.now(),
        maxResults: 10000,
      };
  
      chrome.history.search(query, (results) => {
        if (request.searchType === "day" && request.dayFilter) {
          results = results.filter((item) => {
            const visitDay = new Date(item.lastVisitTime).toLocaleString("en-US", { weekday: "long" }).toLowerCase();
            return visitDay === request.dayFilter;
          });
        }
  
        sendResponse({ results });
      });
  
      return true; // Keep the message channel open for the response
    }
  });
  