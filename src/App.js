import React from "react";
import "./App.css";
import Dropdown from "./components/Dropdown/Dropdown";
import getGithubUsers from "./data-services/github-users";

export default class App extends React.Component {

  state = {
    list: [],
  }

  onChange = (item, name) => { console.log(item, name); }

  searchGitHibUsers = (searchQuery) => {
    getGithubUsers(searchQuery)
    .then(
      (githubUsersList) => {
        this.setState({
          list: githubUsersList,
        })
      }
    )
    .catch(
      (error) => {
        console.log("App ~ error", error);
      }
    )
  }

  render() {
    return (
      <>
        <div className="main">
          <div className="container">
            <header className="header">
              <a href="/" className="logo">
                Auto Complete Component Demo
              </a>
            </header>
          </div>
        </div>
        <div className="container pt-5">
        <Dropdown
            id="github-user-search"
            name="location"
            searchable={['Search for location', 'No matching location']}
            title="Select location"
            list={this.state.list}
            searchHandler={this.searchGitHibUsers}
            onChange={this.onChange}
          />
        </div>
      </>
    );
  }
}
