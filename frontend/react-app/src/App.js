import './App.css';
import {BrowserRouter, Navigate, Route, Routes as Switch} from 'react-router-dom';
import {TemaProvider} from './providers/tema';

import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Sobre from './pages/Sobre/Sobre.jsx';
import Area from './pages/Area-do-aluno/Area-do-aluno.jsx'

import Teste from './components/teste.jsx'

function App() {
  return (
    <BrowserRouter>
      <TemaProvider>
        <Switch>
        <Route path='/' exact element={<Home/>}/>
        <Route path='/login' exact element={<Login/>}/>
        <Route path='/sobre' exact element={<Sobre/>}/>
        <Route path='/area-do-aluno' exact element={<Area/>}/>
        <Route path='/teste' exact element={<Teste/>}/>
        <Route path='*' element={<h1>404</h1>}/>
      </Switch>
    </TemaProvider>
    </BrowserRouter>
  );
}

export default App;