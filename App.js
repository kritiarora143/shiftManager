
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import MyTabs from "./navigator/tabNavigator";

const App = () => {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

export default App