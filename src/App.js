import React from 'react';
import Particles from 'particlesjs';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.login = this.login.bind(this);
  }

  componentDidMount() {
    window.onload = function() {
      Particles.init({
        selector: '.background',
        speed: 0.7,
        maxParticles: 200,
        minDistance: 200,
        connectParticles: true,
      });
    };
  }

  login() {
    axios.get('http://localhost:3001/authorize')
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {
    return (
      <div className = 'mainBoard'>
        <div className = 'directory'>
          <div className = 'title'>Flashback</div>
          <button className = 'getStarted' onClick = {() => this.login()}>Get Started</button>
        </div>
        <div className = 'description'>Reminisce with your favorite songs</div>
      </div>
    )
  }
}


export default App;
