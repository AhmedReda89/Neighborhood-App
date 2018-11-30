import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';


export class MapComponent extends Component {


    render() {

        const { google, onMapClicked, restaurants, onPinClick, activePin, showingInfoWindow, selectedRestaurants, grabPinsinfo } = this.props;


        const style = {
            width: '100%',
            height: '100%',
        }
        return (

            <div role="application">
                <Map
                    style={style}
                    className="map"
                    google={google}
                    onMapClicked={onMapClicked}
                    initialCenter={{
                        lat: 30.003371,
                        lng: 31.425826
                    }}
                    zoom={13}

                >

                    {restaurants.map(restaurant =>
                        <Marker
                            key={restaurant.id}
                            id={restaurant.id}
                            ref={grabPinsinfo}
                            name={restaurant.name}
                            position={{
                                lat: restaurant.location.lat,
                                lng: restaurant.location.lng
                            }}
                            animation={(selectedRestaurants.name === restaurant.name) ? google.maps.Animation.BOUNCE : google.maps.Animation.none}
                            onClick={onPinClick}
                        />
                    )}

                    <InfoWindow
                        marker={activePin}
                        visible={showingInfoWindow}
                    >

                        <div>
                            <h3>{selectedRestaurants.name}</h3>
                            <p>Powered by FOUR SQUARE API</p>
                        </div>

                    </InfoWindow>

                </Map>

            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyCU1RNFpYAbRetPqgZQIiz3lSkFJR2LOPU'),
})(MapComponent)