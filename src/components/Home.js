import React from "react";
import { Alert, Form, Badge } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import Loader from "./Loader";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Should I go outside of my home?",
      done: false,
      lastUpdated: "",
      countries: [],
      data: {}
    };
  }

  componentDidMount() {
    this.loadCountriesData();
  }

  loadCountriesData = () => {
    fetch(`https://api.covid19api.com/countries`)
      .then(res => res.json())
      .then(result => {
        this.setState({
          countries: result,
          done: true
        });
      });
  };

  handleCountryChange = selectedUserCountries => {
    const userEnteredCountry = selectedUserCountries[0];
    this.setState({
      done: false
    });
    fetch(`https://api.covid19api.com/summary`)
      .then(res => res.json())
      .then(result => {
        this.setState({
          data: result,
          lastUpdated: new Date(result.Date).toLocaleTimeString(),
          done: true
        });
      })
      .then(result => {
        let selectedCountries = this.state.data.Countries.filter(item => {
          return item.Slug === userEnteredCountry.Slug;
        });
        const selectedCountry = selectedCountries[0];
        selectedCountry.activeCases =
          selectedCountry.TotalConfirmed - selectedCountry.TotalRecovered;
        this.setState({
          selectedCountry: selectedCountry
        });
      });
  };

  render() {
    let optionItems = [];
    for (var i = 0; i < this.state.countries.length; i++) {
      optionItems.push(<option> {this.state.countries[i]} </option>);
    }
    return (
      <div>
        <h1> {this.state.message} </h1>
        {!this.state.done && <Loader />}

        {/* Main form */}
        {this.state.done && (
          <Form>
            <Form.Group controlId="mainForm.SelectCountry">
              <Typeahead
                id="selectCountry"
                multiple={false}
                onChange={this.handleCountryChange}
                placeholder="Choose a Country..."
                options={this.state.countries}
                labelKey="Country"
              />
            </Form.Group>
          </Form>
        )}

        {/* Display result */}
        {this.state.selectedCountry &&
          this.state.selectedCountry.Country &&
          this.state.selectedCountry.activeCases > 0 && (
            <div>
              <Alert variant="danger">
                {this.state.selectedCountry.Country} has total{" "}
                <b>{this.state.selectedCountry.activeCases}</b> active COVID-19 cases.
                Please don't go out!
              </Alert>
              <Badge pill variant="dark">
                Data last updated at {this.state.lastUpdated}
              </Badge>
            </div>
          )}
        {this.state.selectedCountry &&
          this.state.selectedCountry.Country &&
          this.state.selectedCountry.activeCases < 1 && (
            <div>
              <Alert variant="success">
                {this.state.selectedCountry.Country} has <b>no</b> active COVID-19 cases.
                You can go out but follow guidelines issued by local
                authorities.
              </Alert>
              <Badge pill variant="dark">
                Data last updated at {this.state.lastUpdated}
              </Badge>
            </div>
          )}
      </div>
    );
  }
}

export default Home;
