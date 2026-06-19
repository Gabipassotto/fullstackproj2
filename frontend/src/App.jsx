import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './routes/PrivateRoute.jsx';
import { Layout } from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Foods from './pages/Foods.jsx';
import NewFood from './pages/NewFood.jsx';
import FoodDetails from './pages/FoodDetails.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/foods/new" element={<NewFood />} />
          <Route path="/foods/:id" element={<FoodDetails />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

