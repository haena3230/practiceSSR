import React from 'react';
import {Route} from 'react-router-dom';
import Menu from './Components/Menu';
import RedPage from './Pages/RedPage';
import BluePage from './Pages/BluePage';

const App=()=>{
  return(
    <div>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
    </div>
  )
}

export default App;