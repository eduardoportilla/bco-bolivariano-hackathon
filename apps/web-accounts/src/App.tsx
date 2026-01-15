import { Routes, Route } from 'react-router-dom';
import {
  AccountsListPage,
  AccountDetailsPage,
  AccountMovementsPage,
} from './pages';

/**
 * Accounts microfrontend app component with internal routing.
 *
 * This component uses Routes (not BrowserRouter) since the shell provides
 * the router context. The shell mounts this at /accounts/* with a wildcard,
 * allowing this component to handle its own sub-routes.
 *
 * Routes handled:
 * - /accounts (index) -> AccountsListPage
 * - /accounts/:id -> AccountDetailsPage
 * - /accounts/:id/movements -> AccountMovementsPage
 */
export function App() {
  return (
    <Routes>
      <Route index element={<AccountsListPage />} />
      <Route path=":id" element={<AccountDetailsPage />} />
      <Route path=":id/movements" element={<AccountMovementsPage />} />
    </Routes>
  );
}

export default App;
