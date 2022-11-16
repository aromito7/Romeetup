import './Homepage.css'
import firstImage from '../../images/make-new-friends.png'
import secondImage from '../../images/explore-the-outdoors.png'
import thirdImage from '../../images/connect-over-tech.png'

export default () => (
    <div className='triplePictures'>
        <div className='third'>
            <img src={firstImage}/>
            <h3>Make new Friends -></h3>
        </div>
        <div className='third'>
            <img src={secondImage}/>
            <h3>Explore the Outdoors -></h3>
        </div>
        <div className='third'>
            <img src={thirdImage}/>
            <h3>Connect over tech -></h3>
        </div>
        {/* <img src={firstImage}/>
        <img src={secondImage}/>
        <img src={thirdImage}/> */}
    </div>
)
