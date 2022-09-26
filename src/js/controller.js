import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; //polyfilling everything else
import 'regenerator-runtime/runtime'; //polyfilling async
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

////////To start a project
//npm init
//no need for main in package.json
//change test to start:parcel index.html
//add build:parcel build index.html
//install parcel: npm i parcel@next -D
//install all dev packages: npm install
//run npm: npm start
//install polyfills: npm i core-js regenerator-runtime
//add polyfill imports: import core-js/stable
//add polyfill imports: import regenerator-runtime/runtime

///TO BUILD AFTER DOWNLOADING
//delete the dist and parcel cache to start afresh
//add --dist-dir ./dist to the build
//change main in package.json to default if using parcel 2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //Getting ID
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    //0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //1. Updating bookmark view
    bookmarksView.update(model.state.bookmarks);

    //2. Loading RECEIPE
    await model.loadRecipe(id); //an async function will require an await to resolve the promise when an async function calls in another async function
    const { recipe } = model.state;

    //3.RENDERING RECEIPE
    recipeView.render(model.state.recipe);
    //const recipeView = new recipeView(model.state.recipe) //method that would have been used if the whole class was exported
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1. Get search query
    const query = searchView.getQuery();
    resultsView.renderSpinner();
    if (!query) return;

    //2. Load search result
    await model.loadSearchResults(query);

    //3.Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //4.Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1.Render New Results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultPage(goToPage));

  //2.Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //1. Update the receipe servings (in state)
  model.updateServings(newServings);

  //2. Update receipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //ADD or REMOVE bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmarks(model.state.recipe.id);

  //2.Update Bookmark
  recipeView.update(model.state.recipe);

  //3.Render Bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loader spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render boomark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    //history api of the broswers, pushState will enable to change the url without reloading the page, which takes three url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back() //to go to last page

    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
