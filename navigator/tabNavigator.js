import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { DataContext } from '../contexts';
import AvailableShifts from '../screens/AvailableShifts';
import MyShifts from '../screens/MyShifts';

export default () => {
    const [shifts, setShifts] = useState([])
    const Tab = createBottomTabNavigator();
    return (
        <DataContext.Provider value={{ shifts, setShifts }}>
            <Tab.Navigator
                sceneContainerStyle={{}}
                screenOptions={{
                    headerShown: false,
                    tabBarIconStyle: { display: "none" },
                    tabBarLabelStyle: {
                        fontWeight: "700",
                        fontSize: 15, marginBottom: 15
                    }
                }}>
                <Tab.Screen name="My Shifts" component={MyShifts} />
                <Tab.Screen name="Available Shifts" component={AvailableShifts} />
            </Tab.Navigator>
        </DataContext.Provider>
    );
}