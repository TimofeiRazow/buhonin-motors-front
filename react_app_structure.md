# Структура React приложения Kolesa.kz

## Корневая структура проекта

```
kolesa_frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/                    # Переиспользуемые компоненты
│   │   ├── UI/                       # Базовые UI компоненты
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Dropdown/
│   │   │   ├── LoadingSpinner/
│   │   │   ├── Card/
│   │   │   └── index.js
│   │   ├── Layout/                   # Компоненты макета
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── UserMenu.jsx
│   │   │   │   ├── Navigation.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── MainLayout.jsx
│   │   ├── Auth/                     # Компоненты аутентификации
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   ├── PhoneVerification.jsx
│   │   │   └── EmailVerification.jsx
│   │   ├── Listings/                 # Компоненты объявлений
│   │   │   ├── ListingCard.jsx
│   │   │   ├── ListingGrid.jsx
│   │   │   ├── ListingDetails.jsx
│   │   │   ├── ListingForm.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   └── ContactButtons.jsx
│   │   ├── Cars/                     # Компоненты автомобилей
│   │   │   ├── BrandSelector.jsx
│   │   │   ├── ModelSelector.jsx
│   │   │   ├── CarAttributes.jsx
│   │   │   └── CarSpecifications.jsx
│   │   ├── Profile/                  # Компоненты профиля
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── UserStats.jsx
│   │   │   ├── ReviewsList.jsx
│   │   │   └── MyListings.jsx
│   │   ├── Messages/                 # Компоненты сообщений
│   │   │   ├── ConversationsList.jsx
│   │   │   ├── MessageThread.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── ContactSellerModal.jsx
│   │   └── Common/                   # Общие компоненты
│   │       ├── Pagination.jsx
│   │       ├── LocationSelector.jsx
│   │       ├── ImageUploader.jsx
│   │       ├── FavoriteButton.jsx
│   │       └── ShareButton.jsx
│   ├── pages/                        # Страницы приложения
│   │   ├── Home/                     # Главная страница
│   │   │   ├── HomePage.jsx
│   │   │   ├── FeaturedListings.jsx
│   │   │   ├── SearchSection.jsx
│   │   │   └── PopularBrands.jsx
│   │   ├── Auth/                     # Страницы аутентификации
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   ├── Listings/                 # Страницы объявлений
│   │   │   ├── SearchPage.jsx
│   │   │   ├── ListingDetailsPage.jsx
│   │   │   ├── CreateListingPage.jsx
│   │   │   ├── EditListingPage.jsx
│   │   │   └── FavoritesPage.jsx
│   │   ├── Profile/                  # Страницы профиля
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── MyListingsPage.jsx
│   │   │   ├── MyPromotionsPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── StatisticsPage.jsx
│   │   ├── Messages/                 # Страницы сообщений
│   │   │   ├── ConversationsPage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── Payments/                 # Страницы платежей
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── TransactionHistoryPage.jsx
│   │   │   └── PaymentPage.jsx
│   │   ├── Support/                  # Страницы поддержки
│   │   │   ├── SupportPage.jsx
│   │   │   ├── TicketsPage.jsx
│   │   │   ├── CreateTicketPage.jsx
│   │   │   └── FAQPage.jsx
│   │   └── Admin/                    # Административные страницы
│   │       ├── AdminDashboard.jsx
│   │       ├── ModerationPage.jsx
│   │       ├── ReportsPage.jsx
│   │       └── UsersPage.jsx
│   ├── hooks/                        # Кастомные хуки
│   │   ├── auth/
│   │   │   ├── useAuth.js
│   │   │   ├── useLogin.js
│   │   │   ├── useRegister.js
│   │   │   └── useLogout.js
│   │   ├── api/
│   │   │   ├── useListings.js
│   │   │   ├── useCars.js
│   │   │   ├── useLocations.js
│   │   │   ├── useMessages.js
│   │   │   ├── useNotifications.js
│   │   │   └── usePayments.js
│   │   ├── common/
│   │   │   ├── usePagination.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useWebSocket.js
│   │   │   └── useIntersectionObserver.js
│   │   └── index.js
│   ├── services/                     # API сервисы
│   │   ├── api.js                    # Базовый API клиент
│   │   ├── auth.service.js
│   │   ├── listings.service.js
│   │   ├── cars.service.js
│   │   ├── locations.service.js
│   │   ├── messages.service.js
│   │   ├── media.service.js
│   │   ├── payments.service.js
│   │   ├── notifications.service.js
│   │   └── support.service.js
│   ├── store/                        # Управление состоянием (Redux/Zustand)
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── listingsSlice.js
│   │   │   ├── carsSlice.js
│   │   │   ├── locationsSlice.js
│   │   │   ├── messagesSlice.js
│   │   │   └── notificationsSlice.js
│   │   ├── store.js
│   │   └── middleware.js
│   ├── utils/                        # Утилиты
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── storage.js
│   ├── styles/                       # Стили
│   │   ├── globals.css
│   │   ├── components/
│   │   ├── pages/
│   │   └── themes/
│   ├── App.js                        # Основной компонент
│   ├── App.css
│   ├── index.js                      # Точка входа
│   └── index.css
├── package.json
├── .env.example
└── README.md
```

## Основные страницы и их эндпоинты

### 1. Главная страница (HomePage)

**Компоненты:**
- `SearchSection` - поисковая форма
- `FeaturedListings` - рекомендуемые объявления
- `PopularBrands` - популярные марки

**Эндпоинты:**
```javascript
// hooks/api/useHome.js
const useHomePage = () => {
  const featuredListings = useQuery('featured-listings', 
    () => api.get('/api/listings/?featured=true&limit=8')
  );
  
  const popularBrands = useQuery('popular-brands',
    () => api.get('/api/cars/brands?popular=true')
  );
  
  const locations = useQuery('popular-cities',
    () => api.get('/api/locations/cities?popular=true')
  );
};
```

### 2. Страница поиска (SearchPage)

**Компоненты:**
- `SearchFilters` - фильтры поиска
- `ListingGrid` - список объявлений
- `Pagination` - пагинация

**Эндпоинты:**
```javascript
// hooks/api/useListings.js
const useListingsSearch = (filters, page = 1) => {
  return useQuery(
    ['listings', filters, page],
    () => api.get('/api/listings/', { 
      params: { ...filters, page, limit: 20 }
    }),
    { keepPreviousData: true }
  );
};

// Для фильтров
const useCarAttributes = () => ({
  brands: useQuery('car-brands', () => api.get('/api/cars/brands')),
  bodyTypes: useQuery('body-types', () => api.get('/api/cars/body-types')),
  engineTypes: useQuery('engine-types', () => api.get('/api/cars/engine-types')),
  colors: useQuery('colors', () => api.get('/api/cars/colors'))
});
```

### 3. Страница детального просмотра (ListingDetailsPage)

**Компоненты:**
- `ListingDetails` - подробная информация
- `ImageGallery` - галерея изображений
- `ContactButtons` - кнопки связи с продавцом

**Эндпоинты:**
```javascript
// hooks/api/useListingDetails.js
const useListingDetails = (listingId) => {
  const listing = useQuery(
    ['listing', listingId],
    () => api.get(`/api/listings/${listingId}`)
  );

  const incrementView = useMutation(
    () => api.post(`/api/listings/${listingId}/view`)
  );

  const toggleFavorite = useMutation(
    () => api.post(`/api/listings/${listingId}/favorite`)
  );

  return { listing, incrementView, toggleFavorite };
};
```

### 4. Страница создания объявления (CreateListingPage)

**Компоненты:**
- `ListingForm` - форма создания
- `ImageUploader` - загрузка изображений
- `CarSelector` - выбор автомобиля

**Эндпоинты:**
```javascript
// hooks/api/useCreateListing.js
const useCreateListing = () => {
  const createListing = useMutation(
    (data) => api.post('/api/listings/', data),
    {
      onSuccess: (data) => {
        navigate(`/listings/${data.id}`);
      }
    }
  );

  const uploadImages = useMutation(
    (files) => api.post('/api/media/multiple-upload', files)
  );

  return { createListing, uploadImages };
};

// Для выбора автомобиля
const useCarSelection = () => {
  const brands = useQuery('brands', () => api.get('/api/cars/brands'));
  
  const getModels = (brandId) => 
    useQuery(['models', brandId], 
      () => api.get(`/api/cars/brands/${brandId}/models`),
      { enabled: !!brandId }
    );
  
  const getGenerations = (modelId) =>
    useQuery(['generations', modelId],
      () => api.get(`/api/cars/models/${modelId}/generations`),
      { enabled: !!modelId }
    );
};
```

### 5. Страница профиля (ProfilePage)

**Компоненты:**
- `ProfileCard` - карточка профиля
- `UserStats` - статистика пользователя
- `MyListings` - объявления пользователя

**Эндпоинты:**
```javascript
// hooks/api/useProfile.js
const useProfile = () => {
  const profile = useQuery('profile', () => api.get('/api/users/profile'));
  const stats = useQuery('user-stats', () => api.get('/api/users/stats'));
  
  const updateProfile = useMutation(
    (data) => api.put('/api/users/profile', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
      }
    }
  );

  return { profile, stats, updateProfile };
};

const useMyListings = () => {
  return useQuery('my-listings', () => api.get('/api/listings/my'));
};
```

### 6. Страница сообщений (ConversationsPage)

**Компоненты:**
- `ConversationsList` - список диалогов
- `MessageThread` - поток сообщений
- `MessageInput` - ввод сообщений

**Эндпоинты:**
```javascript
// hooks/api/useMessages.js
const useConversations = () => {
  const conversations = useQuery('conversations', 
    () => api.get('/api/conversations/')
  );
  
  const unreadCount = useQuery('unread-count',
    () => api.get('/api/conversations/unread-count'),
    { refetchInterval: 30000 }
  );

  return { conversations, unreadCount };
};

const useConversation = (conversationId) => {
  const messages = useQuery(
    ['messages', conversationId],
    () => api.get(`/api/conversations/${conversationId}/messages`)
  );

  const sendMessage = useMutation(
    (message) => api.post(`/api/conversations/${conversationId}/messages`, message)
  );

  const markAsRead = useMutation(
    () => api.post(`/api/conversations/${conversationId}/read`)
  );

  return { messages, sendMessage, markAsRead };
};

// WebSocket для real-time сообщений
const useWebSocketMessages = (conversationId) => {
  const [socket, setSocket] = useState(null);
  const { data: auth } = useAuth();

  useEffect(() => {
    if (auth?.token && conversationId) {
      const ws = new WebSocket(`ws://localhost:5000/ws/conversations/${conversationId}?token=${auth.token}`);
      setSocket(ws);
      
      return () => ws.close();
    }
  }, [auth?.token, conversationId]);

  return socket;
};
```

## Основные хуки

### 1. Хук аутентификации

```javascript
// hooks/auth/useAuth.js
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/api/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const { access_token, user } = response.data;
    
    localStorage.setItem('token', access_token);
    setToken(access_token);
    setUser(user);
    
    return user;
  };

  const logout = () => {
    api.post('/api/auth/logout');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { user, token, loading, login, logout, isAuthenticated: !!user };
};
```

### 2. Хук для уведомлений

```javascript
// hooks/api/useNotifications.js
const useNotifications = () => {
  const notifications = useQuery('notifications',
    () => api.get('/api/notifications/'),
    { refetchInterval: 60000 }
  );

  const unreadCount = useQuery('notifications-unread',
    () => api.get('/api/notifications/unread-count'),
    { refetchInterval: 30000 }
  );

  const markAsRead = useMutation(
    (notificationId) => api.put(`/api/notifications/${notificationId}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notifications-unread');
      }
    }
  );

  const markAllAsRead = useMutation(
    () => api.put('/api/notifications/mark-all-read'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notifications-unread');
      }
    }
  );

  return { notifications, unreadCount, markAsRead, markAllAsRead };
};
```

### 3. Хук для локаций

```javascript
// hooks/api/useLocations.js
const useLocations = () => {
  const countries = useQuery('countries', () => api.get('/api/locations/countries'));
  
  const getRegions = (countryId) =>
    useQuery(['regions', countryId],
      () => api.get(`/api/locations/regions?country_id=${countryId}`),
      { enabled: !!countryId }
    );

  const getCities = (regionId) =>
    useQuery(['cities', regionId],
      () => api.get(`/api/locations/regions/${regionId}/cities`),
      { enabled: !!regionId }
    );

  const searchCities = (query) =>
    useQuery(['cities-search', query],
      () => api.get(`/api/locations/cities/search?q=${query}`),
      { enabled: query.length > 2 }
    );

  return { countries, getRegions, getCities, searchCities };
};
```

## Управление состоянием (Redux Toolkit)

```javascript
// store/slices/authSlice.js
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  }
});

// Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
```

## API клиент

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.post('/api/auth/refresh', { refresh_token: refreshToken });
        const { access_token } = response.data;
        
        localStorage.setItem('token', access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## Маршрутизация (React Router)

```javascript
// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from './store/store';

const queryClient = new QueryClient();

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
              <Route path="/messages" element={
                <ProtectedRoute>
                  <ConversationsPage />
                </ProtectedRoute>
              } />
              
              {/* Админские маршруты */}
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminRoutes />
                </AdminRoute>
              } />
            </Routes>
          </MainLayout>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}
```

## Защищенные компоненты

```javascript
// components/Common/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};
```

Эта структура обеспечивает:
- Модульность и переиспользование компонентов
- Эффективное управление состоянием
- Кэширование данных с React Query
- Типизацию с TypeScript (при необходимости)
- Оптимистичные обновления UI
- Real-time функционал через WebSocket
- Защищенные маршруты и авторизацию
- Удобную структуру для масштабирования