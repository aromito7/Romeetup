import './Homepage.css'
import firstImage from '../../images/make-new-friends.png'
import secondImage from '../../images/explore-the-outdoors.png'
import thirdImage from '../../images/connect-over-tech.png'
import {Link} from 'react-router-dom';

export default () => {
return(
    <div className='triplePictures'>
        <Link to="/find" className='homepage-third'>
            <img src={firstImage}/>
            <h3 id="nu1">Make new Friends -></h3>
        </Link>
        <Link to="/find" className='homepage-third'>
            <img src={secondImage}/>
            <h3 id="nu2">Explore the Outdoors -></h3>
        </Link>
        <Link to="/find" className='homepage-third'>
            <img src={thirdImage}/>
            <h3 id="nu3">Connect over tech -></h3>
        </Link>
        {/* <img src={firstImage}/>
        <img src={secondImage}/>
        <img src={thirdImage}/> */}
    </div>
)}
