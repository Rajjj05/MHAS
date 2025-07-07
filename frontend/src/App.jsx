import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";

// Lazy load pages
const Home = React.lazy(() => import("./pages/Home"));
const MentalHealthChat = React.lazy(() => import("./pages/MentalHealthChat"));
const SpiritualChat = React.lazy(() => import("./pages/SpiritualChat"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const History = React.lazy(() => import("./pages/History"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-gradient-to-br from-tranquil-50 via-warm-50 to-tranquil-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PageTransition>
                            <Home />
                          </PageTransition>
                        }
                      />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route
                        path="/mental-health"
                        element={
                          <ProtectedRoute>
                            <PageTransition>
                              <MentalHealthChat />
                            </PageTransition>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/spiritual"
                        element={
                          <ProtectedRoute>
                            <PageTransition>
                              <SpiritualChat />
                            </PageTransition>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/about"
                        element={
                          <PageTransition>
                            <About />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/contact"
                        element={
                          <PageTransition>
                            <Contact />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/history"
                        element={
                          <ProtectedRoute>
                            <PageTransition>
                              <History />
                            </PageTransition>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </AnimatePresence>
              </main>
              <Footer />
            </div>
          </Router>
        </QueryClientProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
