import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//Auth
import Login from './components/login';
import Register from './components/register';

//Cliente
import Home from './components/clientes/home';
import RestauranteInfo from './components/clientes/RestauranteInfo';
import MinhasReservas from './components/clientes/minhas-reservas';
import ClientesDefinicoes from './components/clientes/clientesDefinicoes';

//Admin
import AdminHome from './components/admin/HomeAdmin';
import AdminPedidosRegistos from './components/admin/adminPedidosRegisto';
import AdminUtilizadores from './components/admin/adminUtilizadores';



//Restaurantes
import HomeRestaurantes from './components/restaurantes/home-restaurante';
import RestauranteaddMenu from './components/restaurantes/restaurante-addMenu';
import RestauranteMenu from './components/restaurantes/restauranteMenus';
import RestauranteHorarios from './components/restaurantes/restauranteHorarios';
import RestauranteReservas from './components/restaurantes/restauranteReservas';
import PedidosDeRegisto from './components/restaurantes/pedidoDeRegisto';
import RestauranteMinhaConta from './components/restaurantes/restauranteMinhaConta';




import 'bootstrap/dist/css/bootstrap.min.css';



const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route path="/clientes/home" element={<Home />}></Route>
        <Route path="/clientes/RestauranteInfo/:id" element={<RestauranteInfo />}></Route>
        <Route path="/clientes/minhas-reservas" element={<MinhasReservas />}></Route>
        <Route path="/clientes/clientesDefinicoes" element={<ClientesDefinicoes />}></Route>

        <Route path="/admin/HomeAdmin" element={<AdminHome />}></Route>
        <Route path="/admin/adminPedidosRegisto" element={<AdminPedidosRegistos />}></Route>
        <Route path="/admin/adminUtilizadores" element={<AdminUtilizadores />}></Route>

        <Route path="/restaurantes/home-restaurante" element={<HomeRestaurantes />}></Route>
        <Route path="/restaurantes/restaurante-addMenu" element={<RestauranteaddMenu />}></Route>
        <Route path="/restaurantes/restauranteMenus" element={<RestauranteMenu />}></Route>       
        <Route path="/restaurantes/pedidoDeRegisto" element={<PedidosDeRegisto />}></Route>
        <Route path="/restaurantes/restauranteHorarios" element={<RestauranteHorarios />}></Route>
        <Route path="/restaurantes/restauranteReservas" element={<RestauranteReservas />}></Route>
        <Route path="/restaurantes/restauranteMinhaConta" element={<RestauranteMinhaConta />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
