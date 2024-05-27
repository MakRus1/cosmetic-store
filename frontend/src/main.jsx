import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'

// Private
import PrivateRoute from './components/PrivateRoute.jsx'

// Auth
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'

import Profile from './pages/User/Profile.jsx'

import AdminRoute from './pages/Admin/AdminRoute.jsx'
import UserList from './pages/Admin/UserList.jsx'
import MarkList from './pages/Admin/MarkList.jsx'
import ModelList from './pages/Admin/ModelList.jsx'
import CarList from './pages/Admin/CarList.jsx'
import CarUpdate from './pages/Admin/CarUpdate.jsx'
import AllCars from './pages/Admin/AllCars.jsx'
import Home from './Home.jsx'
import Favorites from './pages/Cars/Favorites.jsx'
import CarDetails from './pages/Cars/CarDetails.jsx'
import Shop from './pages/Shop.jsx'
import Cart from './pages/Cars/Cart.jsx'
import Shipping from './pages/Orders/Shipping.jsx'
import PlaceOrder from './pages/Orders/PlaceOrder.jsx'
import Order from './pages/Orders/Order.jsx'
import UserOrder from './pages/User/UserOrder.jsx'
import OrderList from './pages/Admin/OrderList.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route index={true} path='/' element={<Home />} />
      <Route path='/favorite' element={<Favorites />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/car/:id' element={<CarDetails />} />
      <Route path='/shop' element={<Shop />} />
      <Route path='/user-orders' element={<UserOrder />} />

      <Route path='' element={<PrivateRoute />}> 
        <Route path='/profile' element={<Profile />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/order/:id' element={<Order />} />
      </Route>

      <Route path='/admin' element={<AdminRoute />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='userlist' element={<UserList />} />
        <Route path='marklist' element={<MarkList />} />
        <Route path='modellist' element={<ModelList />} />
        <Route path='carlist' element={<CarList />} />
        <Route path='allcars' element={<AllCars />} />
        <Route path='orderlist' element={<OrderList />} />
        <Route path='car/update/:id' element={<CarUpdate />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
