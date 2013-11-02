///<reference path="chrome.d.ts"/>

chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, { "format": "png" }, (dataUrl) => {
        chrome.tabs.create({ "url": dataUrl }, null);
    });
});
