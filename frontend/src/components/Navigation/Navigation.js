import {Link} from 'react-router-dom'
import './Navigation.css'

export default () => {
    return(
    <div id='navigation'>
        <div className='top-left'>
            <Link to='/' className='navbar' id='home'>Romeetup</Link>
        </div>
        <div className='top-right'>
            <Link to='/language' className='navbar' id='language'>English</Link>
            <Link to='/logout' className='navbar' id='logout'>Log out</Link>
            <Link to='/login' className='navbar' id='login'>Log in</Link>
            <Link to='/signup' className='navbar' id='signup'>Sign up</Link>
        </div>
    </div>
)}
