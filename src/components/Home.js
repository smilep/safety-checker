import React from "react";

import Form from "react-bootstrap/Form";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Should I go out of my home?",
      selectedCountry: "",
      done: false,
      countries: [],
      data: {}
    };
  }

  componentDidMount() {
    fetch(`https://api.covid19api.com/summary`)
      .then(res => res.json())
      .then(result => {
        const countries = result.Countries.map(item => item.Country);
        this.setState({ data: result, countries: countries, done: true });
      });
  }

  handleCountryChange = e => {
    let selectedCountries = this.state.data.Countries.filter(item => {
      return item.Country === e.target.value;
    });
    this.setState({ selectedCountry: selectedCountries[0] });
  };

  render() {
    let optionItems = [];
    for (var i = 0; i < this.state.countries.length; i++) {
      optionItems.push(<option>{this.state.countries[i]}</option>);
    }
    return (
      <div className='col-md-7'>
        <h1>{this.state.message}</h1>
        <Form>
          <Form.Group controlId="mainForm.SelectCountry">
            <Form.Label>Select Country</Form.Label>
            <Form.Control
              as="select"
              value={this.state.selectedCountry.Country}
              onChange={this.handleCountryChange}
            >
              {optionItems}
            </Form.Control>
          </Form.Group>
        </Form>
        {this.state.selectedCountry &&
          this.state.selectedCountry.Country &&
          this.state.selectedCountry.TotalConfirmed && (
            <div>
              {this.state.selectedCountry.Country} has total{" "}
              {this.state.selectedCountry.TotalConfirmed} cases. Please don't go
              out!
            </div>
          )}
        {this.state.selectedCountry &&
          this.state.selectedCountry.Country &&
          !this.state.selectedCountry.TotalConfirmed && (
            <div>
              {this.state.selectedCountry.Country} has total{" "}
              {this.state.selectedCountry.TotalConfirmed} cases. You can go out
              but follow local authorities messages!
            </div>
          )}
      </div>
    );
  }
}

export default Home;
