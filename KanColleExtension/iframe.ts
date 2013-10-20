window.addEventListener("load", (e) => {
    var id = window.setInterval((e) => {
        var flash = document.getElementById("externalswf");
        console.log(flash);
        if (flash != null) {
            var url = flash.getAttribute("src");
            location.href = url;
            window.clearInterval(id);
        }
    }, 100);
});