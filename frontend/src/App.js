import Homepage from './components/Homepage';
import Navigation from './components/Navigation/index';
import topRightImage from './images/top-right-blob.png';
import centerLeftImage from './images/center-left-blob.png';
import centerImage from './images/center-blob.png';
import { Route, Switch } from 'react-router-dom';
import './css/App.css';
import LoginFormPage from './components/LoginFormPage';
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";
import SignupFormPage from './components/SignupFormPage';
import Logout from './components/Logout';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
      <div id='app'>
        <img src={centerLeftImage} id='center-left-blob' className='blob'/>
        <img src={topRightImage} id='top-right-blob' className='blob'/>

        <Navigation isLoaded={isLoaded}/>
        <div id='main'>

          <img src={centerImage} id='center-blob' className='blob'/>
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
