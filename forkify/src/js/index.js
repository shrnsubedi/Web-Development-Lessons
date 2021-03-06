import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
//Global State of the app
//--Search object
//--Current recipie object
//--Shopping list object
//--Liked recipies

const state = {};

const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput();
  if (query) {
    //2. New Search object and add to state
    state.search = new Search(query);
    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    //4. Search for recipies
    await state.search.getResults();

    //5. Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
