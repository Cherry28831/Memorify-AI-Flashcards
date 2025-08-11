improve my score

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="*" element={<NotFound />} />
  </Routes>
  </BrowserRouter>
  </QueryClientProvider>
);

export default App;
