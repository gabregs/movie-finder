import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Movie from './Movie';

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error('Request was either a 404 or 500');
};

const json = (response) => response.json();

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state; // ES6 destructuring
    searchTerm = searchTerm.trim(); // clean the string
    if (!searchTerm) {
      // make sure the value isn't an empty string
      return; // early return
    }

    //api link http://www.omdbapi.com/?i=tt3896198&apikey=c5568abe
    // make the AJAX request to OMDBAPI to get a list of results
    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=c5568abe`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }

        if (data.Response === 'True' && data.Search) {
          this.setState({ results: data.Search, error: '' });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  render() {
    const { searchTerm, results, error } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2"
                placeholder="Search Movie"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
            {(() => {
              if (error) {
                return error;
              }
              return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              });
            })()}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <MovieFinder />
  </React.StrictMode>,
  document.getElementById('root')
);
