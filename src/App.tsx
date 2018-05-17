import * as React from 'react';
import './App.css';

interface AppProps extends React.Props<{}> {
  start: () => void;
  stop: () => void;
  changeVol: (n: number) => void;
}

interface AppState {
  isPlaying: boolean;
}

export default class App extends React.Component <AppProps, AppState> {
  constructor (props: AppProps) {
    super(props);
    this.state = {
      isPlaying: false
    };
  }
  handleClick = () => {
    if (!this.state.isPlaying) {
      this.props.start();
      this.setState({ isPlaying: true });
      return;
    }
    this.props.stop();
    this.setState({ isPlaying: false });
  }
  handleSliderChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    // be careful!! if you give the number over 1.0, it's dangerous...
    this.props.changeVol(parseInt(e.target.value, 10) / 127.0);
  }
  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-header__title">Welcome to my example</h1>
        </header>
        <div className="controllers">
          <p>
            <button onClick={this.handleClick} className="controllers__play-stop">{this.state.isPlaying ? 'Stop' : 'Play'}</button>
          </p>
          <div className="controllers__volume">
            <p className="controllers__volume-label">Volume</p>
            <p className="controllers__volume-input">
              <input
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
