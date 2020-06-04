import React, { useEffect, useState } from 'react'
import ReactMapboxGl, { Feature, Layer } from 'react-mapbox-gl' 
import Pin from '../../img/pin.png'
import ILocation from '../../utils/ILocation'

interface IMap {
    onChangeLocation: Function
}

const Map = ReactMapboxGl({
    accessToken: String(process.env.REACT_APP_MAPBOX_KEY),
})

const image = new Image(50, 50);
image.src = Pin;
const images = ['mapPin', image];

const MapComponent: React.FC<IMap> = ({ onChangeLocation }) => {
    const [location, setLocation] = useState<ILocation | null>(null)
    const [pin, setPin] = useState<ILocation | null>(null)

    function getInitialLocation() {
        navigator.geolocation.getCurrentPosition(result => {
            const { latitude, longitude } = result.coords

            setLocation({ latitude, longitude })
            setPin({ latitude, longitude })
            onChangeLocation({ latitude, longitude })
        })
    }

    useEffect(() => getInitialLocation())

    function addPin(map: any, e: any) {
        const { lng, lat } = e.lngLat
        setLocation({
            latitude: lat,
            longitude: lng
        })
        
        map.flyTo({
            center: [lng, lat]
        })

        setPin({
            latitude: lat,
            longitude: lng
        })

        onChangeLocation({
            latitude: lat,
            longitude: lng
        })
    }

    return (
        <div className="map">
            {location && (
                <Map
                    style="mapbox://styles/mapbox/light-v10"
                    containerStyle={{
                        height: '340px', 
                        marginBottom: '64px', 
                        borderRadius: '8px'
                    }}
                    center={[location.longitude, location.latitude]}
                    onClick={addPin}
                >
                    <Layer 
                        type="symbol" 
                        layout={{ "icon-image": "mapPin", "icon-allow-overlap": true}}
                        images={images}
                    >
                        {pin && (
                            <Feature coordinates={[pin.longitude, pin.latitude]}></Feature>
                        )}
                    </Layer>
                </Map>
            )}
        </div>
    )
}

export default MapComponent