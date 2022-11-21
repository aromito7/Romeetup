// frontend/src/components/Navigation/index.js
import React, {useState, useRef, useEffect } from 'react';
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
  const [credential, setCredential] = useState('');
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSubmittedLogin, setHasSubmittedLogin] = useState(false)
  const [errors, setErrors] = useState([]);
  const [loginErrors, setLoginErrors] = useState([])

  const ref = useRef();
  const history = useHistory();
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmittedLogin(true)
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(res => showLoginModal(false))
      .catch(async (res) => {
        const data = await res.json();
      });
  }

  const onModalClickEvents = () => {
    setShowUserModal(false)
    history.push("/find")
  }

  const onModalClickGroups = () => {
    setShowUserModal(false)
    history.push("/find/groups")
  }

  const onModalCreateGroup = () => {
    setShowUserModal(false)
    history.push("/groups/new")
  }

  const onModalClickLogout = () =>{
    setShowUserModal(false)
    dispatch(sessionActions.logout()).then(() => <Redirect to="/"/>)
    history.push("/")
  }

  useEffect(() => {
    const checkClick = e => {
      if (showUserModal && ref.current && !ref.current.contains(e.target)) {
        setShowUserModal(false)
        setErrors([])
      }
      if (showSignUpModal && ref.current && !ref.current.contains(e.target)) {
        setShowSignUpModal(false)
        setErrors([])
      }
    }

    document.addEventListener("mousedown", checkClick)

    return () => {
      document.removeEventListener("mousedown", checkClick)
    }
  }, [showUserModal, showLoginModal, showSignUpModal])

  const handleSubmitSignup = (e) => {
    e.preventDefault();
    setHasSubmitted(true)
    if(errors.length < 1){
      const newUser = {
        firstName,
        lastName,
        email,
        username,
        password
      }

    return dispatch(sessionActions.signup(newUser))
      .catch(async (res) => {
        const data = await res.json();
      });
    }
  };

  useEffect(() => {
    const validationErrors = []
    if(!firstName) validationErrors.push("First Name is required")
    if(!lastName) validationErrors.push("Last Name is required")
    if(!email) validationErrors.push("Email is required")
    if(!username) validationErrors.push("Username is required")
    if(!password) validationErrors.push("Please enter a password")
    if(password.length < 6) validationErrors.push("Password must be at least six characters")
    if(!confirmPassword)  validationErrors.push("Please confirm password")
    if(password && confirmPassword && (password !== confirmPassword)){
      validationErrors.push("Passwords do not match")
    }
    setErrors(validationErrors)
  },[firstName, lastName, email, username, password, confirmPassword])

  useEffect(() => {
    const validationErrors = []
    if(!credential) validationErrors.push("Username or email is required")
    if(!loginPassword) validationErrors.push("Password is required")
    setLoginErrors(validationErrors)
  },[credential, loginPassword])

  const UserModal = () => (
    <div hidden={!showUserModal} id="nav-user-modal" className="nav-modal" ref={ref}>
      <p onClick={onModalClickEvents}>Your events</p>
      <p onClick={onModalClickGroups}>Your groups</p>
      <hr/>
      <p onClick={onModalCreateGroup}>Create a group</p>
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
    <>
      <p id="session-user-name">{sessionUser.firstName}</p>
      <div>
          <button id="show-user-modal" onClick={() => setShowUserModal(true)}><i className="fa-solid fa-user fa-2xl"></i></button>
          <UserModal/>
      </div>
    </>
    );
  } else {
    sessionLinks = (
    <>
        <label className='navbar'><i className="fa-solid fa-globe fa-sm"></i>English</label>
        <button className='navbar' id='nav-login' onClick={() => setShowLoginModal(!showLoginModal)}>Log in</button>
        <div hidden={!showLoginModal} id="nav-login-modal" className="nav-modal">
          <form noValidate={true} onSubmit={handleSubmit}>
            <label>
              Username or Email
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  />
              </label>
              <ul>
                {hasSubmittedLogin && loginErrors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
              <button type="submit" formNoValidate={true}>Log In</button>
            </form>
        </div>
        <button className='navbar' id='nav-signup' onClick={() => {setShowSignUpModal(true); setShowLoginModal(false)}}>Sign up</button>
        <div hidden={!showSignUpModal} id="nav-signup-modal" className="nav-modal" ref={ref}>
          <form noValidate={true} onSubmit={handleSubmitSignup} id='signup'>
          <label>
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              />
          </label>
          <label>
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              />
          </label>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              />
          </label>
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              />
          </label>
          {hasSubmitted &&
          <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          }
          <button type="submit" formNoValidate={true}>Sign Up</button>
        </form>
      </div>
    </>
    );
  }

  return (
    <div id='navigation'>
        <div className='top-left'>
            <NavLink to='/' className='navbar' id='romeetup'>RoMeetup</NavLink>
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
