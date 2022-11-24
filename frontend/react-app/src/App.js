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
import Pesquisa from './pages/Pesquisa/Pesquisa.jsx';
import Exercicios from './pages/Exercicios/Exercicios.jsx';
import NotFound from './pages/404/404.jsx';
import Carrinho from './pages/Carrinho/Carrinho.jsx';
import Categoria from './pages/Categoria/Categoria.jsx';
import Atendimento from './pages/Atendimento/Atendimento.jsx';

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
          <Route path='/sobre/:id' exact element={<Sobre/>}/>
          <Route path='/painel' exact element={
            <PrivateRoute>
              <Painel/>
            </PrivateRoute>
          }/>
          <Route path='/curso/:id' exact element={
          <Authentication>
            <PrivateRoute>
              <Curso/>
            </PrivateRoute>
          </Authentication>
          }/>
          <Route path='/curso/:id/exercicios' exact element={
          <Authentication>
            <PrivateRoute>
              <Exercicios/>
            </PrivateRoute>
          </Authentication>
          }/>
          <Route path='/pesquisa' exact element={<Pesquisa/>}/>
          <Route path='/carrinho' exact element={
          <PrivateRoute>
            <Carrinho/>
          </PrivateRoute>
          }/>
          <Route path='/atendimento' exact element={
          <PrivateRoute>
            <Atendimento/>
          </PrivateRoute>
          }/>
          <Route path='/categorias' exact element={<Categoria/>}/>
          <Route path='/teste' exact element={<Teste/>}/>
          <Route path='*' element={<NotFound/>}/>
      </Switch>
    </TemaProvider>
    </Authentication>
    </BrowserRouter>
  );
}

export default App;