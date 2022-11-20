// frontend/src/components/Navigation/index.js
import React, {useState} from 'react';
import { NavLink, useHistory, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import icon from '../../images/internet.png'
import './Navigation.css';
import * as sessionActions from '../../store/session'

function Navigation({ isLoaded }){
  const [showUserModal, setShowUserModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch()


  const onModalClickEvents = () => {
    setShowUserModal(false)
    history.push("/find")
  }

  const onModalClickGroups = () =>{
    setShowUserModal(false)
    history.push("/find/groups")
  }

  const onModalClickLogout = () =>{
    setShowUserModal(false)
    dispatch(sessionActions.logout()).then(() => <Redirect to="/"/>)
    history.push("/")
  }

  const LoginModal = () => {
    <div>

    </div>
  }

  const UserModal = () => (
    <div hidden={!showUserModal} id="nav-user-modal">
      <p onClick={onModalClickEvents}>Your events</p>
      <p onClick={onModalClickGroups}>Your groups</p>
      <hr/>
      <p onClick={onModalClickLogout}>Log out</p>
    </div>
  )

  let sessionLinks;
  // <NavLink to={{pathname:'/groups/new', state: {modal: true}}} className='navbar' id='new-group'>Start a new group</NavLink>
  // <NavLink to='/language' className='navbar' id='language'><i className="fa-solid fa-globe"/>English</NavLink>
  // <NavLink to='/logout' className='navbar' id='logout'>Log out</NavLink>
  if (sessionUser) {
    sessionLinks = (
    <div>
        <button id="show-modal" onClick={() => setShowUserModal(!showUserModal)}><i className="fa-solid fa-user fa-2xl"></i></button>
        <UserModal/>
    </div>
    );
  } else {
    sessionLinks = (
    <>
        <NavLink to='/language' className='navbar' id='language'><i className="fa-solid fa-globe fa-sm"></i>English</NavLink>
        <NavLink to='/login' className='navbar' id='login'>Log in</NavLink>
        <NavLink to='/signup' className='navbar' id='signup'>Sign up</NavLink>
    </>
    );
  }

  return (
    <div id='navigation'>
        <div className='top-left'>
            <NavLink to='/' className='navbar' id='romeetup'>Romeetup</NavLink>
            <div id="navigation-search">
              <input id="first" placeholder="Search for keywords"></input>
              <input placeholder='Enter location'></input>
              <button onClick={() => history.push("/find")}><i className="fas fa-search"></i></button>
            </div>
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
