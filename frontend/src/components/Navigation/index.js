// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import icon from '../../images/internet.png'
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
    <>
        <NavLink to={{pathname:'/groups/new', state: {modal: true}}} className='navbar' id='new-group'>Start a new group</NavLink>
        <NavLink to='/language' className='navbar' id='language'><i className="fa-solid fa-globe"/>English</NavLink>
        <NavLink to='/logout' className='navbar' id='logout'>Log out</NavLink>
    </>
    );
  } else {
    sessionLinks = (
    <>
        <NavLink to='/language' className='navbar' id='language'><img src={icon} id="language-icon"/>English</NavLink>
        <NavLink to='/login' className='navbar' id='login'>Log in</NavLink>
        <NavLink to='/signup' className='navbar' id='signup'>Sign up</NavLink>
    </>
    );
  }

  return (
    <div id='navigation'>
        <div className='top-left'>
            <NavLink to='/' className='navbar' id='romeetup'>Romeetup</NavLink>
        </div>
        <div className='top-right'>
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
