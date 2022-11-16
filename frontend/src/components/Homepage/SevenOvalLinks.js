import './Homepage.css'
import {Link} from 'react-router-dom';

export default () => (
    <div id="seven-links">
        <Link to="/find" className='seven-links'>Boost your career</Link>
        <Link to="/find" className='seven-links'>Find your zen</Link>
        <Link to="/find" className='seven-links'>Get moving</Link>
        <Link to="/find" className='seven-links'>Share language + culture</Link>
        <Link to="/find" className='seven-links'>Read with friends</Link>
        <Link to="/find" className='seven-links'>Write together</Link>
        <Link to="/find" className='seven-links'>Hone your craft</Link>
    </div>
)
