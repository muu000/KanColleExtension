window.addEventListener("load", (e) => {
    // game
    var main = document.getElementById("w");
    main.style.cssFloat = "left";

    // add extension space
    var article = document.createElement("article");
    article.style.cssFloat = "left";
    main.parentNode.insertBefore(article, main.nextSibling);

    // full flash
    var fullFlashButton = document.createElement("a");
    fullFlashButton.innerText = "full flash";
    fullFlashButton.style.fontSize = "2em";
    fullFlashButton.href = "javascript:void(0);";
    fullFlashButton.addEventListener("click", (e) => {
        var iframe = document.getElementById("game_frame");
        var url = iframe.getAttribute("src");
        location.href = url;
        return false;
    });
    article.appendChild(fullFlashButton);
});