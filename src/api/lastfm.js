const LASTFM_API_KEY = '70bc1c39ae330d9cd698b7cc221febb6';
const BASE_URL = `http://ws.audioscrobbler.com/2.0/?api_key=${LASTFM_API_KEY}&format=json`;

function api(data) {
  const queryString = Object.keys(data).map((value) => (
    `${value}=${encodeURIComponent(data[value])}`
  )).join('&');
  const url = `${BASE_URL}&${queryString}`;
  return fetch(url).then((response) => response.json());
}

export default {
  getTopTracksByArtist(artist, page=1) {
    return api({ method: 'artist.gettoptracks', artist, page })
      .then((data) => data.toptracks.track);
  },
  getTopTracksByTag(tag, page=1) {
    return api({ method: 'tag.gettoptracks', tag, page })
      .then((data) => data.tracks.track);
  },
};
