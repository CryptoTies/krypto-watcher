import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CoinDetails from './pages/CoinDetails';
import MyAccount from './pages/MyAccount';
import MyCryptos from './pages/MyCryptos';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Navigate replace to='/home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/coin/:id' element={<CoinDetails />} />
        <Route path='/my-cryptos' element={<MyCryptos />} />
        <Route path='/account/:uuid' element={<MyAccount />} />
        <Route path='*' element={<h1>404! Page not Found</h1>} />
      </Routes>
    </Layout>
  );
};

export default App;
