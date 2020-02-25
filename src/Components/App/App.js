import React from 'react';
import logo from './favicon.ico';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

class App extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      searchResults: [
        {
          id: 1,
          name: 'Jay',
          artist: 'Jay Chou',
          album: 'Fantacy'
        }, 
        {
          id: 2,
          name: 'JJ',
          artist: 'JJ Lin',
          album: 'Jiangnan'
        }, {
          id: 3,
          name: 'Tylar',
          artist: 'Love',
          album: 'April'
        }],

      playlistName: "Play List Name",

      playlistTracks:[{
          id: 1,
          name: 'Track 1',
          artist: 'A',
          album: 'Album 1'
      }, {
        id: 2,
        name: 'Track 2',
        artist: 'B',
        album: 'Album 2'
      }, ]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }


  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({
      playlistTracks: tracks
    });
  }

  removeTrack(track){
        let tracks = this.state.playlistTracks;
        //The filter() method creates a new array with all elements that pass the test implemented by the provided function.
        tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)

        this.setState({
          playlistTracks: tracks
        });
  }

  updatePlaylistName(name){
    this.setState({
      playlistName: name
    })

  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=>{
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      })
    })

  }

  search(term) {
    //Use .then() to use the search result
    Spotify.search(term).then(searchResults =>{
      this.setState({
        searchResults: searchResults
      })
    });
    
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack} 
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}
          />
          </div>
        </div>
      </div>
    )

  }
  
}

export default App;
