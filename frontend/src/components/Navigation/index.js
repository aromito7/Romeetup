// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
    <>
        <ProfileButton user={sessionUser} />
        <NavLink to='/logout' className='navbar' id='logout'>Log out</NavLink>
    </>
    );
  } else {
    sessionLinks = (
    <>
        <NavLink to='/login' className='navbar' id='login'>Log in</NavLink>
        <NavLink to='/signup' className='navbar' id='signup'>Sign up</NavLink>
    </>
    );
  }

  return (
    <div id='navigation'>
        <div className='top-left'>
            <NavLink to='/' className='navbar' id='home'>Romeetup</NavLink>
        </div>
        <div className='top-right'>
            <NavLink to='/language' className='navbar' id='language'>English</NavLink>
            {sessionLinks}
        </div>
    </div>
    // <ul>
    //   <li>
    //     <NavLink exact to="/">Home</NavLink>
    //     {isLoaded && sessionLinks}
    //   </li>
    // </ul>
  );
}

export default Navigation;
