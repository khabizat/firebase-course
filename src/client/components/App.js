/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import 'tailwindcss/tailwind.css';
import { Toaster } from 'react-hot-toast';
import Layout from './Layout';
import { UserProvider } from './user-context';
import PrivateRoute from './PrivateRoute';

import Home from '../pages/Home';
import MyList from '../pages/MyList';
import Users from '../pages/Users';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';

const App = () => (
  <Router>
    <UserProvider>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <PrivateRoute path="/my-list" component={MyList} />

          <PrivateRoute path="/users" exact component={Users} />

          <PrivateRoute path="/users/:uid" component={Profile} />

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Layout>
      <Toaster />
    </UserProvider>
  </Router>
);

export default App;
