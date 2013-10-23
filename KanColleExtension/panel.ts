///<reference path="chrome.d.ts"/>

// record
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var json = content.substr(7);
        var data = JSON.parse(json);

        document.getElementById("ship").innerText = data.api_data.api_ship[0] + "/" + data.api_data.api_ship[1];
        document.getElementById("slotitem").innerText = data.api_data.api_slotitem[0] + "/" + data.api_data.api_slotitem[1];
        document.getElementById("material").innerText = data.api_data.api_material_max;
    });
}, { urls: ["*://*/kcsapi/api_get_member/record"] });

// ndock
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var json = content.substr(7);
        var data = JSON.parse(json);
        if (data.api_data.length != 4 || typeof(data.api_data[0].api_ship_id) == "undefined") {
            return;
        }

        var table = document.getElementById("ndock");
        data.api_data.forEach((d) => {

            var tr = table.getElementsByTagName("tr").item(d.api_id - 1);
            tr.getElementsByTagName("td")[1].innerText = d.api_complete_time_str;
        });
    });
}, { urls: ["*://*/kcsapi/api_get_member/ndock"] });

// deck_port
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var json = content.substr(7);
        var data = JSON.parse(json);

        var table = document.getElementById("deck");
        data.api_data.forEach((d) => {
            if (d.api_id == 1) {
                return;
            }
            var tr = table.getElementsByTagName("tr").item(d.api_id - 2);
            tr.getElementsByTagName("td")[1].innerText = getRemainingTime(d.api_mission[2]) + "sec";
        });
    });
}, { urls: ["*://*/kcsapi/api_get_member/deck_port"] });

// kdock
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var json = content.substr(7);
        var data = JSON.parse(json);
        if (data.api_data.length != 4 || typeof(data.api_data[0].api_created_ship_id) == "undefined") {
            return;
        }

        var table = document.getElementById("kdock");
        data.api_data.forEach((d) => {
            var tr = table.getElementsByTagName("tr").item(d.api_id - 1);
            tr.getElementsByTagName("td")[1].innerText = d.api_complete_time_str;
            tr.getElementsByTagName("td")[2].innerText = d.api_created_ship_id;
            tr.getElementsByTagName("td")[3].innerText = "(" + d.api_item1 + "/" + d.api_item2 + "/" + d.api_item3 + "/" + d.api_item4 + ")";
        });
        // api_member_id, api_complete_time, api_created_ship_id, api_item1/2/3/4, main_ship
    });
}, { urls: ["*://*/kcsapi/api_get_member/kdock"] });

function getRemainingTime(time) {
    var now = new Date().getTime();
    var remain = time - now;
    return (remain > 0) ? (remain / 1000) : 0;
}