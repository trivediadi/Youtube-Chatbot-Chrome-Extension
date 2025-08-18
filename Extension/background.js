
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === "complete" &&
        tab.url &&
        tab.url.includes("youtube.com/watch")
    ) {
        const queryParams = new URL(tab.url).searchParams;
        const videoId = queryParams.get("v");
        console.log("Detected videoID:", videoId);

        chrome.storage.local.set({ currentVideoId: videoId });
    }
});
