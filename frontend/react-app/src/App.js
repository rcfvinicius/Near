import './App.css';
import {BrowserRouter, Navigate, Route, Routes as Switch} from 'react-router-dom';
import {TemaProvider} from './providers/tema';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Sobre from './pages/Sobre/Sobre.jsx';
import Teste from './components/teste';


function App() {
  return (
    <BrowserRouter>
      <TemaProvider>
        <Switch>
        <Route path='/' exact element={<Home/>}/>
        <Route path='/login' exact element={<Login/>}/>
        <Route path='/sobre' exact element={<Sobre/>}/>
        <Route path='*' element={<h1>404</h1>}/>
      </Switch>
    </TemaProvider>
    </BrowserRouter>
  );
}

export default App;
