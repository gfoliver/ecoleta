import React, {useState, useEffect} from 'react'
import { View, StyleSheet, Image, Text, Linking } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon, FontAwesome5 as FIcon } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import IItem from '../../utils/IItem'
import IPoint from '../../utils/IPoint'
import { RootStackParamList } from '../../routes'
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer'

const Point = () => {
    const navigation = useNavigation()
    const route = useRoute<RouteProp<RootStackParamList, 'point'>>()
    const { id } = route.params
    const [point, setPoint] = useState<IPoint | null>(null)
    const [name, setName] = useState<string>('')

    function goBack() {
        navigation.goBack()
    }

    useEffect(() => {
        api.get('/points/' + id).then(response => {
            if (response.data.status) {
                setPoint(response.data.point)
                setName(response.data.point.name)
            }
        }).catch(error => {
            console.log(error)
        })
    }, [])

    const defaultMessage = `Olá, estou entrando em contato pois encontrei seu ponto de coleta "${name}" no Ecoleta!`

    function navigateWhatsapp() {
        if (!point)
            return

        Linking.openURL(`whatsapp://send?phone=+55${point.whatsapp}&text=${defaultMessage}`)
    }

    function navigateEmail() {
        if (!point)
            return
        
        MailComposer.composeAsync({
            subject: `Ecoleta | ${point.name}`,
            recipients: [point.email],
            body: defaultMessage
        })
    }

    return (
        <>
            <View style={styles.container}>
                <RectButton onPress={goBack} style={styles.logoutButton}>
                    <Icon name="arrow-left" color="#34CB79" size={24} />
                </RectButton>

                {point && (
                    <>
                        <Image source={{uri: point.image}} style={styles.coverImage} />
                        <Text style={styles.title}>{point.name}</Text>
                        {point.items && (
                            point.items.map((item: IItem) => (
                                <Text key={item.id} style={styles.tags}>
                                    {item.title}
                                </Text>
                            ))
                        )}
                        <Text style={styles.addressTitle}>Endereço</Text>
                        <Text style={styles.address}>{point.city}, {point.state}</Text>
                    </>
                )}
            </View>
            {point && (
                <View style={styles.buttonsWrapper}>
                    <RectButton style={styles.button} onPress={navigateWhatsapp}>
                        <FIcon name="whatsapp" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Whatsapp</Text>
                    </RectButton>
                    <RectButton style={styles.button} onPress={navigateEmail}>
                        <Icon name="mail" size={20} color="#fff" />
                        <Text style={styles.buttonText}>E-mail</Text>
                    </RectButton>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: Constants.statusBarHeight,
    },

    logoutButton: {
        width: 24,
        marginBottom: 30
    },

    coverImage: {
        width: '100%',
        height: 185,
        borderRadius: 8,
        marginBottom: 24
    },

    title: {
        fontSize: 30,
        color: '#3D3D4D',
        fontFamily: 'Ubuntu_700Bold',
        fontWeight: 'bold',
        marginBottom: 16
    },

    tags: {
        fontSize: 20,
        fontFamily: 'Roboto_700Bold',
        fontWeight: 'bold',
        color: '#34CB79',
        marginBottom: 40
    },

    addressTitle: {
        fontFamily: 'Ubuntu_700Bold',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#322153'
    },

    address: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 18,
        color: '#6C6C80'
    },

    buttonsWrapper: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 8
    },

    button: {
        backgroundColor: '#34CB79',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 30,
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    buttonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Roboto_700Bold',
        marginLeft: 10,
        textAlign: 'center',
        flex: 1
    }
})

export default Point