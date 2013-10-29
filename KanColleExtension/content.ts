window.addEventListener("load", (e) => {
    var a = document.createElement("a");
    a.href = "javascript:void(0);";
    a.addEventListener("click", (ev) => {
        var iframe = document.getElementById("game_frame");
        var url = iframe.getAttribute("src");
        location.href = url;
        return false;
    });
    var p = document.createElement("p");
    p.innerText = "Full Flash";
    a.appendChild(p);
    var li = document.createElement("li");
    li.className = "bt-sup";
    li.appendChild(a);
    var target = document.getElementById("btns");
    target.appendChild(li);
});
