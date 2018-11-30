import React, { Component } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import MapComponent from './components/Map';
import './App.css';
import * as restaurants from './restaurants';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars)

class App extends Component {

  state = {
    restaurants: [],
    showingInfoWindow: false,
    activePin: {},
    selectedRestaurant: {},
    query: '',
    gMapError: false,
    foursquareError: false
  }

  componentDidMount() {
    this.fetchFoursquare();
    window.gm_authFailure = () => {
      this.setState({ gMapError: true })
    };
  }

  fetchFoursquare = () => {
    let longURL = 'https://api.foursquare.com/v2/venues/search?ll=30.003371,31.425826&query=restaurant&limit=8&client_id=WBNBINDT4M1UZRGVORVNJGM4ZIXDPCRUELYGVWDGOFVIP4UK&client_secret=ASDVDY2BOYG3ZRKMXXAV3IXLYOP5BKVD2GIJAG2VHDQKUZVG&v=20180803';

    fetch(longURL)
      .then(response => {
        if (!response.ok) {
          throw Error(response.status)
        } else {
          return response.json();
        }
      }).then(restaurants => {
        this.setState({ restaurants: restaurants.response.venues });
      }).catch(error => {
        this.setState({ foursquareError: true })
        alert("Failed to fetch data, please try again")
      })
  }

  updateQuery = (query) => {
    this.setState({ query })
  }

  pins = [];
  grabPinsinfo = (pin) => {

    if (pin !== null) {
      this.pins.push(pin)
    }
  }

  onPinClick = (props, pin, e) =>
    this.setState({
      selectedRestaurant: props,
      activePin: pin,
      showingInfoWindow: true
    });

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activePin: null
      })
    }
  };

  connectLiToPin = (restaurant) => {
    this.pins.filter(m => {
      if (m.props.id === restaurant.id) {
        return new m.props.google.maps.event.trigger(m.pin, 'click')
      }
    })
  }



  render() {

    const { restaurants, activePin, showingInfoWindow, selectedRestaurant, query, foursquareError, gMapError } = this.state;


    let showingRestaurants;
    if (query.trim() !== '') {
      const match = new RegExp(escapeRegExp(query), 'i');
      showingRestaurants = restaurants.filter((restaurant) => match.test(restaurant.name));

      if (match.length === 0) {
        showingRestaurants = [];
      }

    } else {
      showingRestaurants = restaurants;
    }

    showingRestaurants.sort(sortBy('name'))


    return (
      <div className="App">

        <Header />
        <Menu
          restaurants={showingRestaurants}
          onPinClick={this.onPinClick}
          activePin={activePin}
          showingInfoWindow={showingInfoWindow}
          connectLiToPin={this.connectLiToPin}
          query={query}
          updateQuery={this.updateQuery}
          fetchError={foursquareError}
        />
        {!gMapError ?
          <MapComponent

            restaurants={showingRestaurants}
            onMapClicked={this.onMapClicked}
            onPinClick={this.onPinClick}
            activePin={activePin}
            showingInfoWindow={showingInfoWindow}
            selectedRestaurants={selectedRestaurant}
            grabPinsinfo={this.grabPinsinfo}
            fetchError={foursquareError}
          />
          : <h1 className="gmerror">Google maps loading failed</h1>
        }
      </div>
    );
  }
}

export default App;
