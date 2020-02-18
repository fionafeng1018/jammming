import React from 'react';
import logo from './favicon.ico';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

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
          artist: 'JJ Line',
          album: 'Jiangnan'
        }, {
          id: 3,
          name: 'JJ',
          artist: 'JJ Line',
          album: 'Jiangnan'
        }]
    }
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults}/>
          <Playlist />
          </div>
        </div>
      </div>
    )

  }
  
}

export default App;
