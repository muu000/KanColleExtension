///<reference path="chrome.d.ts"/>

window.addEventListener("load", (ev) => {
    window.setInterval((e) => {
        var times = document.getElementsByClassName("complete_time");
        for (var i = 0; i < times.length; i++) {
            var item = times.item(i);
            if (item.attributes.getNamedItem("complete_time") != null) {
                item.textContent = getFormattedRemainingTime(item.attributes.getNamedItem("complete_time").value);
            }
        }
    }, 100);
});

// record
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);

        document.getElementById("ship").innerText = data.api_data.api_ship[0] + "/" + data.api_data.api_ship[1];
        document.getElementById("slotitem").innerText = data.api_data.api_slotitem[0] + "/" + data.api_data.api_slotitem[1];
        document.getElementById("material").innerText = data.api_data.api_material_max;
    });
}, { urls: ["*://*/kcsapi/api_get_member/record"] });

// ndock
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);
        if (data.api_data.length != 4 || typeof (data.api_data[0].api_ship_id) == "undefined") {
            return;
        }

        var table = document.getElementById("ndock");
        data.api_data.forEach((d) => {

            var tr = table.getElementsByTagName("tr").item(d.api_id - 1);
            tr.getElementsByTagName("td")[1].innerText = (d.api_ship_id > 0) ? ship_member[d.api_ship_id].api_name : d.api_ship_id;
            tr.getElementsByTagName("td")[2].className = "complete_time";
            tr.getElementsByTagName("td")[2].setAttribute("complete_time", d.api_complete_time);
            tr.getElementsByTagName("td")[2].innerText = getFormattedRemainingTime(d.api_complete_time);
        });
    });
}, { urls: ["*://*/kcsapi/api_get_member/ndock"] });

// deck_port
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);

        var table = document.getElementById("deck");
        data.api_data.forEach((d) => {
            if (d.api_id == 1) {
                return;
            }
            var tr = table.getElementsByTagName("tr").item(d.api_id - 2);
            tr.getElementsByTagName("td")[1].className = "complete_time";
            tr.getElementsByTagName("td")[1].setAttribute("complete_time", d.api_mission[2]);
            tr.getElementsByTagName("td")[1].innerText = getFormattedRemainingTime(d.api_mission[2]);
        });
    });
}, { urls: ["*://*/kcsapi/api_get_member/deck_port"] });

// kdock
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);
        if (data.api_data.length != 4 || typeof (data.api_data[0].api_created_ship_id) == "undefined") {
            return;
        }

        var table = document.getElementById("kdock");
        data.api_data.forEach((d) => {
            var tr = table.getElementsByTagName("tr").item(d.api_id - 1);
            tr.getElementsByTagName("td")[1].className = "complete_time";
            tr.getElementsByTagName("td")[1].setAttribute("complete_time", d.api_complete_time);
            tr.getElementsByTagName("td")[1].innerText = getFormattedRemainingTime(d.api_complete_time);
            tr.getElementsByTagName("td")[2].innerText = (d.api_created_ship_id > 0 && typeof (ship_master[d.api_created_ship_id]) != "undefined") ? ship_master[d.api_created_ship_id].api_name : d.api_created_ship_id;
            tr.getElementsByTagName("td")[3].innerText = "(" + d.api_item1 + "/" + d.api_item2 + "/" + d.api_item3 + "/" + d.api_item4 + ")";
        });
        // api_member_id, api_complete_time, api_created_ship_id, api_item1/2/3/4, main_ship
    });
}, { urls: ["*://*/kcsapi/api_get_member/kdock"] });

// quest
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);
        if (typeof (data.api_data.api_list) == "undefined") {
            return;
        }

        document.getElementById("exec_count").innerText = data.api_data.api_exec_count;

        var page = data.api_data.api_disp_page;
        var table = document.getElementById("quest");
        data.api_data.api_list.forEach((d, i) => {
            if (d == -1) {
                return;
            }
            var tr = table.getElementsByTagName("tr").item((page - 1) * 5 + i);
            tr.setAttribute("state", d.api_state);
            tr.getElementsByTagName("td")[0].innerText = d.api_title;
            tr.getElementsByTagName("td")[1].innerText = d.api_progress_flag;
            tr.getElementsByTagName("td")[2].innerText = d.api_state;
        });
    });
}, { urls: ["*://*/kcsapi/api_get_member/questlist"] });

// ship master
var ship_master = {};
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);
        if (data.api_data.length < 200 || typeof (data.api_data[0].api_yomi) == "undefined") {// ‘SŠÍ‚È‚Ì‚Å200ˆÈã‚ ‚é‚Í‚¸
            return;
        }

        data.api_data.forEach((d) => {
            ship_master[d.api_id] = d;
        });
        var li = document.createElement("li");
        li.innerText = "get ship master";
        document.getElementById("log").appendChild(li);
    });
}, { urls: ["*://*/kcsapi/api_get_master/ship"] });

// ship member
var ship_member = {};
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);
        if (typeof (data.api_data[0].api_yomi) == "undefined"
            || typeof (data.api_data[0].getmes) != "undefined") {
            return;
        }

        data.api_data.forEach((d) => {
            ship_member[d.api_id] = d;
        });
        var li = document.createElement("li");
        li.innerText = "get ship member";
        document.getElementById("log").appendChild(li);
    });
}, { urls: ["*://*/kcsapi/api_get_member/ship"] });

// destroy ship
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        //var data = parseKscapi(content);

        //var li = document.createElement("li");
        //li.innerText = "destroy ship";
        //document.getElementById("log").appendChild(li);
    });
}, { urls: ["*://*/kcsapi/api_req_kousyou/destroyship"] });

function parseKscapi(content) {
    var json = content.substr(7);
    return JSON.parse(json);
}

function getRemainingTime(time) {
    var now = new Date().getTime();
    var remain = time - now;
    return (remain > 0) ? (remain / 1000) : 0;
}

function getFormattedRemainingTime(time) {
    var seconds = Math.floor(getRemainingTime(time));
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    var hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
    return hours + ":" + minutes + ":" + seconds;
}