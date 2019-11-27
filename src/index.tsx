import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#41C0AF',
            main: '#41C0AF',
            dark: '#41C0AF',
        }
    }
})

ReactDOM.render(
<ThemeProvider theme={theme}><App /></ThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
