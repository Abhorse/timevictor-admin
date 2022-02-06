import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Notfound from './components/NotFound404';
import DashBoard from './containers/dashboard/dashboard';
import PrivateRoute from './containers/PrivateRoute';
import WelcomePage from './containers/welcome/welcomePage';
import LoginTemplete from './containers/auth/LoginTemplete';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={WelcomePage} />
        <Route path='/login' exact component={LoginTemplete} />
        <PrivateRoute path='/admin' component={DashBoard} />
        <Route component={Notfound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
