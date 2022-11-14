import Homepage from './components/Homepage';
import Navigation from './components/Navigation';
import topRightImage from './images/top-right-blob.png';
import centerLeftImage from './images/center-left-blob.png';
import centerImage from './images/center-blob.png';
import './css/App.css';

function App() {
  return (
      <div id='app'>
        <img src={centerLeftImage} id='center-left-blob' className='blob'/>
        <img src={topRightImage} id='top-right-blob' className='blob'/>
        <Navigation/>
        <div id='main'>
          <img src={centerImage} id='center-blob' className='blob'/>
          <Homepage/>
        </div>
      </div>
  );
}

export default App;
