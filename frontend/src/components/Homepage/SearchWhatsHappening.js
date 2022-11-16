import './Homepage.css'
import {Link} from 'react-router-dom';

export default () => (
    <div className='half-row'>
        <div>
            <h1>What do you want to do?</h1>
            <div className='half-row'>
                <input type="text" placeholder='Search for "tennis"'/>
                <input type="text" placeholder='Neighborhood or City or zip'/>
            </div>
            <div id="search-box">
                <Link to="/find" id="find">Search</Link>
            </div>
        </div>
        <div>
            <h1>See what's happening</h1>
            <div id="wrap-links">
                <Link to='/find' className='seven-links'>Starting soon</Link>
                <Link to='/find' className='seven-links'>Today</Link>
                <Link to='/find' className='seven-links'>Tomorrow</Link>
                <Link to='/find' className='seven-links'>This week</Link>
                <Link to='/find' className='seven-links'>Online</Link>
                <Link to='/find' className='seven-links'>In person</Link>
                <Link to='/find' className='seven-links'>Trending near you</Link>
            </div>
        </div>
    </div>
)
