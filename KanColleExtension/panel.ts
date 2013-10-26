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

        document.getElementById("ship_num").innerText = data.api_data.api_ship[0] + "/" + data.api_data.api_ship[1];
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
            tr.getElementsByTagName("td")[1].innerText = (d.api_ship_id > 0 && typeof (ship_member[d.api_ship_id]) != "undefined") ? ship_member[d.api_ship_id].api_name : d.api_ship_id;
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
            tr.getElementsByTagName("td")[1].innerText = d.api_mission[1];// mission_id
            tr.getElementsByTagName("td")[2].className = "complete_time";
            tr.getElementsByTagName("td")[2].setAttribute("complete_time", d.api_mission[2]);
            tr.getElementsByTagName("td")[2].innerText = getFormattedRemainingTime(d.api_mission[2]);
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

// deck member
chrome.devtools.network.onRequestFinished.addListener((request) => {
    request.getContent((content, encoding) => {
        var data = parseKscapi(content);
        if (typeof (data.api_data_deck) == "undefined") {
            return;
        }

        var li = document.createElement("li");
        li.innerText = "get deck member";
        document.getElementById("log").appendChild(li);

        var ships = {};
        var table = document.getElementById("ship");
        var tbody = document.createElement("tbody");
        data.api_data.forEach((d, i) => {
            ships[d.api_id] = d;

            var tr = document.createElement("tr");
            var td = document.createElement("td");
            td.innerText = i + 1;
            tr.appendChild(td);
            var td = document.createElement("td");
            td.innerText = d.api_ship_id;
            tr.appendChild(td);
            tbody.appendChild(tr);
        });
        table.replaceChild(tbody, table.firstChild);

        table = document.getElementById("deck_ship");
        tbody = document.createElement("tbody");
        data.api_data_deck.forEach((d, i) => {
            var tr0 = document.createElement("tr");
            var tdDeckName = document.createElement("td");
            tdDeckName.innerText = d.api_name;
            tdDeckName.setAttribute("rowspan", "6");
            tr0.appendChild(tdDeckName);
            var exist0 = d.api_ship[0] > 0;
            var ship0 = exist0 ? ships[d.api_ship[0]] : null;
            var tdName0 = document.createElement("td");
            tdName0.innerText = (exist0 && typeof (ship_master[ship0.api_ship_id]) != "undefined") ? ship_master[ship0.api_ship_id].api_name : (exist0 ? ship0.api_ship_id : "-");
            tr0.appendChild(tdName0);
            var tdCond0 = document.createElement("td");
            tdCond0.innerText = exist0 ? ship0.api_cond : "";
            tr0.appendChild(tdCond0);
            tbody.appendChild(tr0);

            var tr1 = document.createElement("tr");
            var exist1 = d.api_ship[1] > 0;
            var ship1 = ships[d.api_ship[1]];
            var tdName1 = document.createElement("td");
            tdName1.innerText = (exist1 && typeof (ship_master[ship1.api_ship_id]) != "undefined") ? ship_master[ship1.api_ship_id].api_name : (exist1 ? ship1.api_ship_id : "-");
            tr1.appendChild(tdName1);
            var tdCond1 = document.createElement("td");
            tdCond1.innerText = exist1 ? ship1.api_cond : "";
            tr1.appendChild(tdCond1);
            tbody.appendChild(tr1);

            var tr2 = document.createElement("tr");
            var exist2 = d.api_ship[2] > 0;
            var ship2 = ships[d.api_ship[2]];
            var tdName2 = document.createElement("td");
            tdName2.innerText = (exist2 && typeof (ship_master[ship2.api_ship_id]) != "undefined") ? ship_master[ship2.api_ship_id].api_name : (exist2 ? ship2.api_ship_id : "-");
            tr2.appendChild(tdName2);
            var tdCond2 = document.createElement("td");
            tdCond2.innerText = exist2 ? ship2.api_cond : "";
            tr2.appendChild(tdCond2);
            tbody.appendChild(tr2);

            var tr3 = document.createElement("tr");
            var exist3 = d.api_ship[3] > 0;
            var ship3 = ships[d.api_ship[3]];
            var tdName3 = document.createElement("td");
            tdName3.innerText = (exist3 && typeof (ship_master[ship3.api_ship_id]) != "undefined") ? ship_master[ship3.api_ship_id].api_name : (exist3 ? ship3.api_ship_id : "-");
            tr3.appendChild(tdName3);
            var tdCond3 = document.createElement("td");
            tdCond3.innerText = exist3 ? ship3.api_cond : "";
            tr3.appendChild(tdCond3);
            tbody.appendChild(tr3);

            var tr4 = document.createElement("tr");
            var exist4 = d.api_ship[4] > 0;
            var ship4 = ships[d.api_ship[4]];
            var tdName4 = document.createElement("td");
            tdName4.innerText = (exist4 && typeof (ship_master[ship4.api_ship_id]) != "undefined") ? ship_master[ship4.api_ship_id].api_name : (exist4 ? ship4.api_ship_id : "-");
            tr4.appendChild(tdName4);
            var tdCond4 = document.createElement("td");
            tdCond4.innerText = exist4 ? ship4.api_cond : "";
            tr4.appendChild(tdCond4);
            tbody.appendChild(tr4);

            var tr5 = document.createElement("tr");
            var exist5 = d.api_ship[5] > 0;
            var ship5 = ships[d.api_ship[5]];
            var tdName5 = document.createElement("td");
            tdName5.innerText = (exist5 && typeof (ship_master[ship5.api_ship_id]) != "undefined") ? ship_master[ship5.api_ship_id].api_name : (exist5 ? ship5.api_ship_id : "-");
            tr5.appendChild(tdName5);
            var tdCond5 = document.createElement("td");
            tdCond5.innerText = exist5 ? ship5.api_cond : "";
            tr5.appendChild(tdCond5);
            tbody.appendChild(tr5);
        });
        table.replaceChild(tbody, table.firstChild);
    });
}, { urls: ["*://*/kcsapi/api_get_member/ship2"] });

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