import Homepage from './components/Homepage/Homepage';
import Navigation from './components/Navigation/index';
import { Route, Switch } from 'react-router-dom';
import './css/App.css';
import LoginFormPage from './components/LoginFormPage';
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";
import SignupFormPage from './components/SignupFormPage';
import Logout from './components/Logout';
import FindPage from './components/FindPage/index'
import CreateGroupPage from './components/CreateGroupPage';
import ShowEvent from './components/ShowEvent';
import ShowGroup from './components/ShowGroup';
import EditGroupPage from './components/EditGroupPage';
import CreateEventPage from './components/CreateEventPage';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
      <div id='app'>
        <Navigation isLoaded={isLoaded}/>
        <div id='main'>
          <Switch>
            <Route exact path="/">
              <Homepage/>
            </Route>
            <Route path="/login">
              <LoginFormPage/>
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/signup">
              <SignupFormPage/>
            </Route>
            <Route path="/find">
              <FindPage/>
            </Route>
            <Route path="/groups/new">
              <CreateGroupPage/>
            </Route>
            <Route path="/groups/:groupId/edit">
              <EditGroupPage/>
            </Route>
            <Route path="/groups/:groupId/events/new">
              <CreateEventPage/>
            </Route>
            <Route path="/events/:eventId">
              <ShowEvent/>
            </Route>
            <Route path="/groups/:groupId">
              <ShowGroup/>
            </Route>
            <Route path="/">
              Error 404
            </Route>
          </Switch>
        </div>
      </div>

    // <Switch>
    //   <Route path="/login">
    //     <LoginFormPage />
    //   </Route>
    // </Switch>
  );
}

export default App;
