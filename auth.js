const client_id = "ede376b0eea74a35b1215334183955d0";
const redirect_uri = "https://pawllo01.github.io/spotify-playlist-checker/";
let token;

const prev = document.querySelector(".prev");
const container = document.querySelector(".container");
const tokenLinks = document.querySelectorAll(".token-link");

const generateTokenLink = () => {
    let url = "https://accounts.spotify.com/authorize";
    url += "?client_id=" + client_id;
    url += "&response_type=" + "token";
    url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
    url += "&show_dialog=" + "true";
    tokenLinks.forEach((link) => (link.href = url));
};

const extractTokenFromUrl = () => {
    const regex = /access_token=([^&]*)/;
    const match = regex.exec(window.location.hash);
    if (match) {
        token = match[1];
    } else {
        token = null;
    }
};

const isTokenNull = () => {
    if (token !== null) {
        prev.classList.add("hide");
        container.classList.remove("hide");
    }
};

extractTokenFromUrl();
isTokenNull();
generateTokenLink();
