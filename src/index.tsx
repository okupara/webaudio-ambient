import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { start, stop, changeVol } from './audio';
import App from './App';
import './index.css';

ReactDOM.render(
    <App {...{ start, stop, changeVol }}/>,
    document.getElementById('main') as HTMLElement
);
