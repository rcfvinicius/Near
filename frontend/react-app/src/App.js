import {BrowserRouter, Navigate, Route, Routes as Switch} from 'react-router-dom'
import {TemaProvider} from './providers/tema'
import Teste from './components/teste';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <TemaProvider>
        <Switch>
        <Route path='/' exact element={
          <div className="App">
          <Teste></Teste>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code>
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
              >
              Learn React
            </a>
          </header>
        </div>
    }/>
      <Route path='*' element={<h1>404</h1>}/>
      
      </Switch>
    </TemaProvider>
    </BrowserRouter>
  );
}

export default App;
