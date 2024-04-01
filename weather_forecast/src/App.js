import './App.css';
import AutoComplete from './components/WeatherApp/js/searchSection';


const ShareAPI = () => { 
  return 11111
}


const App = () => {
  const tempArr = [1, 2, 3, 4, 5];
  return (
    // 한 페이지
    <div className="App">
        <AutoComplete className="searchPart" data={tempArr} />
    </div>
  );
}
export { App as default, ShareAPI};
