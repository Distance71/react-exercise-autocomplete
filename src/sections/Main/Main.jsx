import React, { Component } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

import './Main.css';

import { AutoCompleteInputClass } from '../../components';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
    this.fetchCoins = this.fetchCoins.bind(this);
  }

  async fetchCoins(name) {
    const { data: { coins: coinsInfo } } = await axios.get(
      `${API_URL}/coins/list`.concat(name 
        ? `?name=${name}` 
        : ''));
    
    this.setState({ options: coinsInfo });
  };

  componentDidMount() {
    this.fetchCoins();
  }

  render() {
    return (
      <div className="App">
        <body className="App-header">
          <AutoCompleteInputClass 
            options={this.state.options} 
            placeholder="Cryptocurrencies" 
            onChange={this.fetchCoins}
            visibleItems={10}
          />
        </body>
      </div>
    );
  }
}

export default Main;
