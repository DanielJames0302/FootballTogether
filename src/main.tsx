import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'
import { ConvexClientProvider } from './components/providers/convex-provider.tsx';
import router from './router/router.tsx';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexClientProvider>
        <Provider store={store}>
          <RouterProvider router={router}/>
        </Provider>
      
    </ConvexClientProvider>
    
  </React.StrictMode>,
)
