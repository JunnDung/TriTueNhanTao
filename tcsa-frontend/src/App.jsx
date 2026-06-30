import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import PostModeration from './pages/PostModeration';
import CommentModeration from './pages/CommentModeration';
import LiveChat from './pages/LiveChat';
import Analytics from './pages/Analytics';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                   element={<Dashboard />} />
        <Route path="/post-moderation"    element={<PostModeration />} />
        <Route path="/comment-moderation" element={<CommentModeration />} />
        <Route path="/live-chat"          element={<LiveChat />} />
        <Route path="/analytics"          element={<Analytics />} />
        {/* Fallback */}
        <Route path="*"                   element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
