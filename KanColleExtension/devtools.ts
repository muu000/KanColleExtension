///<reference path="chrome.d.ts"/>

chrome.devtools.panels.create("Kan Colle",
    "MyPanelIcon.png",
    "panel.html",
    function (panel) {
        // code invoked on panel creation
    }
);