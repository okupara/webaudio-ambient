import * as React from 'react';
import { start, stop } from './audio';
import './App.css';

export default class App extends React.Component {
  slider: HTMLInputElement;
  play = () => {
    start();
  }
  stop = () => {
    stop();
  }
  handleSliderChange = () => {
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-header__title">Welcome to an example</h1>
        </header>
        <div className="controllers">
          <p>
            <button onClick={()=>{}} className="controllers__play-stop">Play</button>
          </p>
          <div className="controllers__volume">
            <p className="controllers__volume-label">Volume</p>
            <p className="controllers__volume-input">
              <input
                ref={(slider) => { if (slider) this.slider = slider }}
                onChange={this.handleSliderChange}
                type="range"
                min="0.0"
                max="127"
              />
            </p>
          </div>
        </div>
      </div>
    );
  }
}
