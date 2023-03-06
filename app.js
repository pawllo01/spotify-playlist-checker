const input = document.querySelector("input");
const searchBtn = document.querySelector("#search-btn");
const result = document.querySelector("#result");
const tracksContainer = document.querySelector("#tracks-container");

let playlistId;
let fetchedData;
let unavailableTracks;

const handleClick = () => {
    clearContent();

    playlistId = input.value;

    if (playlistId.length !== 22) {
        result.textContent = "Invalid playlist ID";
        return;
    }

    getPlaylistTracks();
};

const clearContent = () => {
    unavailableTracks = 0;
    result.textContent = "";
    tracksContainer.innerHTML = "";
};

async function getPlaylistTracks() {
    let link = "https://api.spotify.com/v1";
    link += "/playlists/" + playlistId;
    link += "/tracks";
    link += "?limit=" + 100;
    link += "&access_token=" + token;
    console.log(link);

    do {
        try {
            const res = await fetch(link);
            fetchedData = await res.json();

            if (res.status === 200) {
                localStorage.setItem("inputValue", input.value);
                appendTracks();
                if (fetchedData.next !== null) link = fetchedData.next + "&access_token=" + token;
            } else {
                result.textContent = `${fetchedData.error.message} (${fetchedData.error.status})`;
                return;
            }
        } catch (e) {
            console.warn(e);
            result.textContent = e;
            return;
        }
    } while (fetchedData.next !== null);

    if (unavailableTracks === 0) {
        result.textContent = "No tracks found on unavailable albums.";
    } else {
        result.textContent = `${unavailableTracks} tracks found:`;
    }
}

const appendTracks = () => {
    fetchedData.items.forEach((item, i) => {
        result.textContent = `Checked: ${i + 1 + fetchedData.offset}/${fetchedData.total}`;

        if (item.track.album.available_markets.length === 0) {
            unavailableTracks += 1;

            const trackDiv = document.createElement("div");
            trackDiv.classList.add("track");

            const albumCover = document.createElement("img");
            albumCover.src = item.track.album.images[2].url;

            const altLink = document.createElement("a");
            altLink.href = "https://kaaes.github.io/albums-availability/#" + item.track.album.id;
            altLink.target = "_blank";
            altLink.append(albumCover);

            const albumLink = document.createElement("a");
            albumLink.textContent = item.track.album.artists[0].name + " - " + item.track.name;
            albumLink.href = item.track.album.external_urls.spotify;
            albumLink.target = "_blank";

            trackDiv.append(altLink, albumLink);
            tracksContainer.append(trackDiv);
        }
    });
};

input.value = localStorage.getItem("inputValue");
searchBtn.addEventListener("click", handleClick);
