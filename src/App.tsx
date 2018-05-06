import * as React from 'react';
import Button from './components/Button';
import { start, stop } from './audio';

export default class App extends React.Component {
  play = () => {
    start();
  }
  stop = () => {
    stop();
  }

  render() {
    return (
      <div>
        {/* <Hello /> */}
        <div>
          <Button handlerClick={this.play}>START</Button>
        </div>
        <div>
          <Button handlerClick={this.stop}>STOP</Button>
        </div>
      </div>
    );
  }
}
