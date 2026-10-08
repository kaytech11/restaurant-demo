import { Navigate } from 'react-router-dom';
import { isAuthed } from '../lib/api.js';

export default function ProtectedRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/admin/login" replace />;
}
