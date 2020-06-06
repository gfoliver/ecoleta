import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import Constants from 'expo-constants'
import { RectButton } from 'react-native-gesture-handler'
import Emoji from 'react-native-emoji'
import MapView, { Region, Marker } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import api from '../../services/api'
import SvgUri from 'expo-svg-uri'
import IPoint from '../../utils/IPoint'
import IItem from '../../utils/IItem'
import { RootStackParamList } from '../../routes'

const Points = () => {
    const navigator = useNavigation()
    const route = useRoute<RouteProp<RootStackParamList, 'points'>>()
    const { state, city } = route.params

    const [location, setLocation] = useState<Region | null>(null)
    const [items, setItems] = useState<IItem[]>([])
    const [activeItems, setActiveItems] = useState<number[]>([])
    
    const [points, setPoints] = useState<IPoint[]>([])
    
    function goBack() {
        navigator.navigate('home')
    }

    function navigateToPoint(id: number) {
        navigator.navigate('point', { id })
    }

    function toggleActive(id: number) {
        const index = activeItems.findIndex(item => item == id)
        if (index > -1) {
            const tmp = activeItems.filter(item => item !== id)
            setActiveItems(tmp)
        }
        else {
            setActiveItems([...activeItems, id])
        }


    }

    function fetchItems() {
        api.get('/items').then(response => {
            if (response.data.status)
                setItems(response.data.items.map((item: IItem) => ({...item, active: false})))
        }).catch(error => {
            console.log(error)
        })
    }

    function fetchPoints() {
        api({
            url: '/points',
            method: 'GET',
            params: {
                city,
                state, 
                items: activeItems
            }
        })
        .then(response => {
            if (response.data.status)
                setPoints(response.data.points)
        })
        .catch(error => {
            console.log(error)
        })
    }

    useEffect(fetchItems, [])

    useEffect(fetchPoints, [activeItems, location])

    useEffect(() => {
        async function getInitialPosition() {
            const granted = await requestPermissionsAsync()

            if (granted) {
                const location = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                })

                const { latitude, longitude } = location.coords

                setLocation({
                    latitude,
                    longitude,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025
                })
            }
        }

        getInitialPosition()
    }, [])

    return (
        <>
            <View style={styles.container}>
                <RectButton onPress={goBack} style={styles.logoutButton}>
                    <Icon name="log-out" style={styles.logoutIcon} color="#34CB79" size={24} />
                </RectButton>
                <View style={styles.row}>
                    <Emoji name="grinning" style={{fontSize: 26}} />
                    <Text style={styles.title}>Bem vindo.</Text>
                </View>
                <Text style={styles.subtitle}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    {location && (
                        <MapView style={styles.map} initialRegion={location}>
                            {points.map(point => (
                                <Marker 
                                    key={point.id}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude
                                    }} 
                                    onPress={() => navigateToPoint(point.id)}
                                >
                                    <Image style={styles.pointImage} source={{uri: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=60'}} />
                                    <Text style={styles.pointText}>{point.name}</Text>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 24}}
                >
                    {items.map(item => (
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[
                                styles.itemButton,
                                activeItems.includes(item.id) ? styles.activeItem : {}
                            ]} 
                            onPress={() => toggleActive(item.id)} 
                            key={item.id}
                        >
                            <SvgUri width={32} height={32} source={{uri: item.image}} />
                            <Text style={styles.itemText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    logoutButton: {
        width: 24,
        marginBottom: 30
    },

    logoutIcon: {
        transform: [{rotate: '180deg'}]
    },

    row: {
        flexDirection: 'row'
    },

    title: {
        fontSize: 26,
        marginBottom: 5,
        color: '#322153',
        fontFamily: 'Ubuntu_700Bold',
        fontWeight: 'bold',
        marginLeft: 12
    },

    subtitle: {
        fontSize: 15,
        color: '#6C6C80',
        fontFamily: 'Roboto_400Regular',
        marginBottom: 24
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
      },
    
    map: {
        width: '100%',
        height: '100%',
    },

    pointImage: {
        width: 70,
        height: 40,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    
    pointText: {
        width: 70,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        backgroundColor: '#34CB79',
        color: '#FFF',
        padding: 3,
        fontSize: 10,
        textAlign: 'center'
    },

    itemsContainer: {
        paddingVertical: 24,
    },

    itemButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        height: 104,
        width: 104,
        justifyContent: 'center',
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center'
    },

    activeItem: {
        backgroundColor: '#E1FAEC',
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#322153',
        fontFamily: 'Roboto_400Regular',
        marginTop: 8
    },
})

export default Points