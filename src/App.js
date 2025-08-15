import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import AdminRoute from './components/Common/AdminRoute';

// Pages
import HomePage from './pages/Home/HomePage';
import SearchPage from './pages/Listings/SearchPage';
import ListingDetailsPage from './pages/Listings/ListingDetailsPage';
import CreateListingPage from './pages/Listings/CreateListingPage';
import EditListingPage from './pages/Listings/EditListingPage';
import FavoritesPage from './pages/Listings/FavoritesPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import ProfilePage from './pages/Profile/ProfilePage';
import MyListingsPage from './pages/Profile/MyListingsPage';
import SettingsPage from './pages/Profile/SettingsPage';
import ConversationsPage from './pages/Messages/ConversationsPage';
import ChatPage from './pages/Messages/ChatPage'; // +
import ServicesPage from './pages/Payments/ServicesPage'; // +
import SupportPage from './pages/Support/SupportPage'; // +
import AdminDashboard from './pages/Admin/AdminDashboard'; // +

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
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <MainLayout>
            <Routes>
              {/* Публичные маршруты */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/listings/:id" element={<ListingDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Защищенные маршруты */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/my-listings" element={
                <ProtectedRoute>
                  <MyListingsPage />
                </ProtectedRoute>
              } />
              <Route path="/create-listing" element={
                <ProtectedRoute>
                  <CreateListingPage />
                </ProtectedRoute>
              } />
              <Route path="/edit-listing/:id" element={
                <ProtectedRoute>
                  <EditListingPage />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <ConversationsPage />
                </ProtectedRoute>
              } />
              <Route path="/messages/:id" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <SupportPage />
                </ProtectedRoute>
              } />
              
              {/* Админские маршруты */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
          </MainLayout>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;