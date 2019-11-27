import React from 'react';
import Particles from 'particlesjs';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorized: false,
      code: '',
      state: '',
      library: {},
      full: false,
    };

    this.login = this.login.bind(this);
    this.collectData = this.collectData.bind(this);
  }

  componentDidMount() {
    const { authorized } = this.state;
    let url = window.location.href;
    let state,
        code;

    if(url.includes('code') && url.includes('state')) {
      state = url.slice(url.indexOf('&state=') + 7);
      code = url.slice(url.indexOf('=') + 1, url.indexOf('&state='));
      
      this.setState({
        authorized: true,
        code,
        state,
      });
    }

    if(url.includes('access_token') && url.includes('refresh_token')) {
      let refresh = url.slice(url.indexOf('&refresh_token=') + 15);
      let access = url.slice(url.indexOf('=') + 1, url.indexOf('&refresh_token='));
      this.collectData(access, refresh, 0);
    }

    if(!authorized) {
      Particles.init({
        selector: '.background',
        speed: 0.7,
        maxParticles: 200,
        minDistance: 200,
        connectParticles: true,
      });
    }
  }

  collectData(access, refresh, offset) {
    const { full, library } = this.state;
    let storage = Object.assign({}, library);

    if(!full) {
      axios.get(`/collectData/`, {
        params: {
          access,
          refresh,
          offset: offset,
        }
      })
      .then(res => {
          for(let i = 0; i < res.data.items.length; i++) {
            let year = res.data.items[0].added_at.slice(0,4);
            let month = res.data.items[0].added_at.slice(5, 7);

            if(storage[year] === undefined) storage[year] = {};
            if(storage[year][month] === undefined) storage[year][month] = [];

            storage[year][month].push([res.data.items[i].track.artists[0].name, res.data.items[i].track.name, res.data.items[i].track.uri]);
          }
          if(res.data.items.length === 50) {
            this.setState({
              library: storage,
              offset: offset + 50,
            }, () => this.collectData(access, refresh, offset + 50))
          } else {
            this.setState({
              library: storage,
              offset: offset + res.data.items.length,
              full: true,
            })
          }
      })
      .catch(err => console.log(err));
    }
  }

  login() {
     window.location.href = 'http://localhost:3001/authorize';
  }


  render() {
    const { authorized } = this.state;
    return (
    <div>
      {!authorized ? 
        <div>
        <canvas class="background"></canvas>
          <div className = 'mainBoard'>
            <div className = 'directory'>
              <div className = 'title'>Flashback</div>
              <button className = 'getStarted' onClick = {this.login}>Get Started</button>
            </div>
            <div className = 'description'>Reminisce with your favorite songs</div>
          </div>
        </div>
        :
        <div>Authorized</div>
      }
    </div>
    )
  }
}


export default App;
