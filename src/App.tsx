import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CoinDetails from './pages/CoinDetails';
import Layout from './components/Layout';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Navigate replace to='/home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/coin/:id' element={<CoinDetails />} />
        <Route path='*' element={<h1>404! Page not Found</h1>} />
      </Routes>
    </Layout>
  );
};

export default App;
