import axios from "axios";

const getGithubUsers = (searchQuery = '') => {
    return axios.get(`https://api.github.com/search/users?q=${searchQuery}`)
      .then(function (response) {
          return response.data.items;
      })
      .catch(function (error) {
        return error;
      });
}

export default getGithubUsers;