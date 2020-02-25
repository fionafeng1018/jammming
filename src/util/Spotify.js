import SearchBar from "../Components/SearchBar/SearchBar";

const clientID = "2010383da62149de8392fc0fa292179c";
const redirect_uri = "http://localhost:3000/";
let accessToken;

const Spotify = {
    getAccessToken() {
        //Check if the user’s access token is already set. If it is, return the value saved to access token
        if (accessToken) {
            return accessToken;
        }

        //If the access token is not already set, check the URL to see if it has just been obtained.

        //Get access token value from the URL parameter after authentication
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);

        //Get expiration time value from the URL parameter after authentication
        const expireInMatch = window.location.href.match(/expires_in=([^&]*)/);

        //Check if the access token and the expiration time are in the URL
        if (accessTokenMatch && expireInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expireInMatch[1]);

            //This clears the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        //need to get access token
        const accessToken = Spotify.getAccessToken();

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if (!jsonResponse) {
                    return [];
                } else {
                    return jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }));
                }
            });
    },

    // Gets a user's ID from Spotify, creates a new playlist on user's account, and adds tracks to that playlist
    savePlaylist(name, trackUris) {
        //Check if there are values saved to the method’s two arguments
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;

        // Return user's ID from Spotify API
        return fetch("https://api.spotify.com/v1/me", {
                headers: headers
            })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                userId = jsonResponse.id;

                // Adds playlist to user's account
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                        headers: headers,
                        method: "POST",
                        body: JSON.stringify({
                            name: name
                        })
                    })
                    .then(response => {
                        return response.json();
                    })
                    .then(jsonResponse => {
                        let playlistID;
                        playlistID = jsonResponse.id;

                        // Adds tracks to new playlist
                        return fetch(
                            `https://api.spotify.com/v1/users/{user_id}/playlists/${playlistID}/tracks`, {
                                headers: headers,
                                method: "POST",
                                body: JSON.stringify({
                                    uris: trackUris
                                })
                            }
                        );
                    });
            });
    }
};

export default Spotify;