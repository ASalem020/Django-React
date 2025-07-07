import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateProject from './pages/CreateProject';
import MyProjects from './pages/MyProjects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="create-project" element={<CreateProject />} />
          <Route path="my-projects" element={<MyProjects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
