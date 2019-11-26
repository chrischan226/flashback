import React from 'react';
import logo from './logo.svg';
import Particles from 'particlesjs';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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

  render() {
    return (
      <div className = 'mainBoard'>
        <div className = 'directory'>
          <div className = 'title'>Flashback</div>
          <button className = 'getStarted'>Get Started</button>
        </div>
        <div className = 'description'>Reminisce with your favorite songs</div>
      </div>
    )
  }
}


export default App;
