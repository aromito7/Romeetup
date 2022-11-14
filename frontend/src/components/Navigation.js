import {Link} from 'react-router-dom'
import '../css/Navigation.css'

export default () => (
    <div id='navigation'>
        <div className='top-left'>
            <Link to='/' className='navbar' id='home'>Romeetup</Link>
        </div>
        <div className='top-right'>
            <Link to='/language' className='navbar' id='language'>English</Link>
            <Link to='/login' className='navbar' id='login'>Log in</Link>
            <Link to='/signup' className='navbar' id='signup'>Sign up</Link>
        </div>
    </div>
)
