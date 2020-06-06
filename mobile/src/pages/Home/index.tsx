import React, { useEffect, useState, ChangeEvent } from 'react'
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { getCities, getStates } from '../../services/ibge'
import { Picker } from '@react-native-community/picker'

const Home = () => {
    const navigator = useNavigation()

    const [states, setStates] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [selectedState, setSelectedState] = useState<string>('')
    const [selectedCity, setSelectedCity] = useState<string>('')

    function navigate() {
        navigator.navigate('points', {
            state: selectedState,
            city: selectedCity
        })
    }

    useEffect(() => {
        getStates().then(response => {
            if (response.status)
                setStates(response.data)
        })
    }, [])

    function handleStateChange(state: string) {
        setSelectedState(state)

        getCities(state).then(response => {
            if (response.status)
                setCities(response.data)
        })
    }

    return (
        <ImageBackground 
            source={require('../../assets/home-background.png')} 
            style={styles.container}
            imageStyle={{ width: 274, height: 368, opacity: .7 }}
        >
            <View style={styles.main}>
                <Image style={styles.logo} source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                <Text style={styles.subtitle}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>
            <View style={styles.selectWrapper}>
                <Picker 
                    selectedValue={selectedState} 
                    onValueChange={state => handleStateChange(String(state))}
                >
                    <Picker.Item value={''} label="Selecione um estado" />
                    {states.map((state, index) => (
                        <Picker.Item key={index} value={state} label={state} />
                    ))}
                </Picker>
            </View>
            <View style={[
                styles.selectWrapper,
                cities.length > 0 ? {} : styles.disabledSelect
            ]}>
                <Picker 
                    selectedValue={selectedCity} 
                    onValueChange={city => setSelectedCity(String(city))}
                    enabled={cities.length > 0}
                >
                    <Picker.Item value={''} label="Selecione uma cidade" />
                    {cities.map((city, index) => (
                        <Picker.Item key={index} value={city} label={city} />
                    ))}
                </Picker>
            </View>
            <RectButton style={styles.button} onPress={navigate}>
                <View style={styles.buttonIcon}>
                    <Icon name="arrow-right" color="#FFF" size={24} />
                </View>
                <Text style={styles.buttonText}>
                    Entrar
                </Text>
            </RectButton>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: '#F0F0F5'
    },

    main: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 80
    },

    logo: {
        marginBottom: 80
    },

    title: {
        color: '#322153',
        fontSize: 30,
        marginBottom: 16,
        fontFamily: 'Ubuntu_700Bold',
        fontWeight: 'bold'
    },

    subtitle: {
        color: '#6C6C80',
        fontSize: 15
    },

    button: {
        backgroundColor: '#34CB79',
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 16
    },

    buttonIcon: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },

    buttonText: {
        color: '#FFF',
        padding: 16,
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'Roboto_700Bold',
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
    },
    
    selectWrapper: {
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        paddingVertical: 8,
        paddingHorizontal: 8
    },

    disabledSelect: {
        opacity: .7
    },
})

export default Home