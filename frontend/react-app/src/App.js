import './App.css';
import {BrowserRouter, HashRouter, Navigate, Route, Routes as Switch} from 'react-router-dom';
import {TemaProvider} from './utils/tema';

import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Sobre from './pages/Sobre/Sobre.jsx';
import Painel from './pages/Painel/Painel.jsx'
import Authentication from './utils/Authentication';
import Curso from './pages/Curso/Curso.jsx';

import PrivateRoute from './utils/PrivateRoute';

import Teste from './components/teste.jsx'

function App() {
  return (
    <BrowserRouter>
      <Authentication>
      <TemaProvider>
        <Switch>
        <Route path='/' exact element={<Home/>}/>
        <Route path='/login' exact element={<Login/>}/>
        <Route path='/cadastro' exact element={<Cadastro/>}/>
        <Route path='/sobre' exact element={<Sobre/>}/>
        <Route path='/painel' exact element={
        <PrivateRoute>
          <Painel/>
        </PrivateRoute>
        }/>
        <Route path='/curso/:id' exact element={
        <PrivateRoute>
          <Curso/>
        </PrivateRoute>
        }/>
        <Route path='/teste' exact element={<Teste/>}/>
        <Route path='*' element={<h1>404</h1>}/>
      </Switch>
    </TemaProvider>
    </Authentication>
    </BrowserRouter>
  );
}

export default App;