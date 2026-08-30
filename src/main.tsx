import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import "@xyflow/react/dist/style.css";
import NavBar from "./components/UI/navBar";
import Upload from "./components/pages/upload";
import { GraphView } from "./components/pages/graph";
import Home from "./components/pages/home";
import Dashboard from "./components/pages/dashboard";
import Signup from "./components/pages/signup";
import Login from "./components/pages/login";
import ProtectedRoute from "./protectedRoute";
import { refresh } from "./api";
import { setAccessToken } from "./auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Notes from "./components/pages/notes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    refresh().catch(() => setAccessToken(null));
  }, []);

  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<Upload />} />
          <Route path="/graph/:id" element={<GraphView />} />
          <Route path="/notes" element={<Notes />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

// 2. Render the App component
createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
