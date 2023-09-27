"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  // console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** Show story submission form on click "submit" */
function navSubmitClick(){
  console.debug("navSubmitClick");
  hidePageComponents();
  $allStoriesList.show();
  $submissionForm.show();
}

$navSubmit.on('click', navSubmitClick);

/** Show list of user favorites */
function navFavoritesClick(){
  console.debug("navFavoritesClick");
  hidePageComponents();
  favsMarkup();
  $favoritesList.show();
}

$navFavorites.on('click', navFavoritesClick);

/** Show user-created stories list */
function navMyStoriesClick(){
  hidePageComponents();
  $userStories.show();
  myStoryMarkup();
}

$navMyStories.on('click', navMyStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-user-actions").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
