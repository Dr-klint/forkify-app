import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; //parcel 2 method

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No receipes found for your query! Please try again :)';
  _message = '';

  _generateMarkUp() {
    return this._data
      .map(results => previewView.render(results, false))
      .join('');
  }
}
export default new ResultsView();
