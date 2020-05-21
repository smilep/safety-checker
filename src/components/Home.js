import React from "react";
import ReactGA from "react-ga";
import { Alert, Form, Badge, Image } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import Loader from "./Loader";
import no from "../assets/no.gif";
import maybe from "../assets/maybe.gif";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Should I go outside home?",
      done: false,
      lastUpdated: "",
      countries: [],
      data: {},
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.loadData();
    this.initializeReactGA();
  }

  initializeReactGA() {
    ReactGA.initialize("UA-164046110-1");
    ReactGA.pageview("/homepage");
  }

  loadData = () => {
    // fetch countries
    fetch(process.env.REACT_APP_COUNTRIES_API)
      .then((res) => res.json())
      .then((result) => {
        result.sort(function (a, b) {
          return a.Slug.localeCompare(b.Slug);
        });
        this.setState({
          countries: result,
        });
      })
      .then(() => {
        // fetch stats summary of all countries
        fetch(process.env.REACT_APP_SUMMARY_API)
          .then((response) => {
            if (!response.ok) {
              throw new Error(response.statusText);
            }
            return response;
          })
          .then((response) => response.json())
          .then((result) => {
            this.setState({
              data: result,
              done: true,
            });
          })
          .catch((error) => {
            alert(error);
          });
      });
  };

  handleCountryChange = (selectedUserCountries) => {
    const userEnteredCountry = selectedUserCountries[0];
    if (!userEnteredCountry) {
      return;
    }
    let selectedCountries = this.state.data.Countries.filter((item) => {
      if (userEnteredCountry.Slug) {
        return item.Slug === userEnteredCountry.Slug;
      }
      return null;
    });
    const selectedCountry = selectedCountries[0];
    if (selectedCountry) {
      selectedCountry.activeCases =
        selectedCountry.TotalConfirmed - selectedCountry.TotalRecovered;
      const date = new Date(selectedCountry.Date);
      const dateStr = date.toDateString() + " " + date.toLocaleTimeString();
      this.setState({
        selectedCountry: selectedCountry,
        lastUpdated: dateStr,
      });
    } else {
      alert("Data not found for " + userEnteredCountry.Country);
    }
    this.ref.current.clear();
    this.ref.current.blur();
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
                ref={this.ref}
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
                {this.state.selectedCountry.Country} has{" "}
                <b>{this.state.selectedCountry.activeCases}</b> active COVID-19
                cases. Please don't go out!
              </Alert>
              <Image src={no} fluid /> <br />
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
                {this.state.selectedCountry.Country} has <b>no</b> active
                COVID-19 cases. You can go out but follow guidelines issued by
                local authorities.
              </Alert>
              <Image src={maybe} fluid /> <br />
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
