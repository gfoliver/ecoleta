import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './pages/Home'
import Points from './pages/Points'
import Point from './pages/Point'

export type RootStackParamList = {
    home: undefined,
    points: {state: string, city: string},
    point: {id: number}
}

const Stack = createStackNavigator<RootStackParamList>()

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                headerMode="none" 
                screenOptions={{
                    cardStyle: {
                        backgroundColor: '#F0F0F5'
                    }
                }}
            >
                <Stack.Screen name="home" component={Home} />
                <Stack.Screen name="points" component={Points} />
                <Stack.Screen name="point" component={Point} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes