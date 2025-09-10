import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import UsersListScreen from './screens/UsersListScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import EditUserScreen from './screens/EditUserScreen';
import RolesListScreen from './screens/RolesListScreen';
import CreateRoleScreen from './screens/CreateRoleScreen';
import EditRoleScreen from './screens/EditRoleScreen';

// Wrapper to pass id param to EditUserScreen
function EditUserScreenWrapper() {
  const { id } = useParams();
  return <EditUserScreen id={id || ''} />;
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/users" element={<UsersListScreen />} />
        <Route path="/users/create" element={<CreateUserScreen />} />
        <Route path="/users/:id/edit" element={<EditUserScreenWrapper />} />
        <Route path="/roles" element={<RolesListScreen />} />
        <Route path="/roles/create" element={<CreateRoleScreen />} />
        <Route path="/roles/:id/edit" element={<EditRoleScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
