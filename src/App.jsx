import React from 'react';
import Spotify from 'spotify-web-api-js';
import './styles/App.css';
import ArtistInput from './components/ArtistInput';
import ArtistInputWithPaper from './components/ArtistInputWithPaper';
import ArtistTree from './components/ArtistTree';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        authenticated: false,
        artists: [],
        devices: [],
        currentDevice: "",
        authToken: "",
        mySpotifyClient: "",
        rootArtist: "",
        isRootSelected: false
    };

    this.handleSelectArtist = this.handleSelectArtist.bind(this);
  }

  async componentDidMount() {
    if (window.location.hash) {
      // Remove the "#"
      const queryString = window.location.hash.substring(1);
      // Parse the access_token out
      const accessToken = new URLSearchParams(queryString).get("access_token");
      this.spotifyClient = new Spotify();
      this.spotifyClient.setAccessToken(accessToken);

      const { devices } = await this.spotifyClient.getMyDevices();
      // const devices = Object.keys(devicesResp).map(key => devicesResp[key]);
      this.setState({
        authenticated: true,
        devices,
        currentDevice: devices[0].id,
        authToken: accessToken,
        mySpotifyClient: this.spotifyClient
      });
    }
  }
  
  handleSelectArtist(artist) {
    this.setState({
      rootArtist: artist,
      isRootSelected: true
    });
  }

  render() {
    const {
      authenticated,
      mySpotifyClient,
      rootArtist,
      isRootSelected
    } = this.state;
    if (!authenticated) {
      return (
        <a
          href={`https://accounts.spotify.com/authorize/?client_id=c905808b09014699b50463170c5c27cb&response_type=token&redirect_uri=${window
              .location.origin +
              window.location
              .pathname}&scope=user-read-playback-state user-modify-playback-state user-top-read user-read-private`}
          >
        Login with Spotify
        </a>
      );
    }
    return (
      <div className="flex-container">
        <ArtistInput spotifyClient={mySpotifyClient} onSubmit={this.handleSelectArtist} />
        <div className="tree-container" >
          {isRootSelected && 
            <ArtistTree spotifyClient={mySpotifyClient} root={rootArtist} />
          }
        </div>
      </div>
    );
  }
}
