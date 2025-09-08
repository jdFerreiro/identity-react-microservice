import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import UsersListScreen from './screens/UsersListScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import EditUserScreen from './screens/EditUserScreen';
import AssignRoleScreen from './screens/AssignRoleScreen';
import RolesListScreen from './screens/RolesListScreen';
import RoleDetailScreen from './screens/RoleDetailScreen';
import CreateRoleScreen from './screens/CreateRoleScreen';
import EditRoleScreen from './screens/EditRoleScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/users" element={<UsersListScreen />} />
        <Route path="/users/create" element={<CreateUserScreen />} />
        <Route path="/users/:id" element={<UserDetailScreen />} />
        <Route path="/users/:id/edit" element={<EditUserScreen />} />
        <Route path="/users/:id/assign-role" element={<AssignRoleScreen />} />
        <Route path="/roles" element={<RolesListScreen />} />
        <Route path="/roles/create" element={<CreateRoleScreen />} />
        <Route path="/roles/:id" element={<RoleDetailScreen />} />
        <Route path="/roles/:id/edit" element={<EditRoleScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
