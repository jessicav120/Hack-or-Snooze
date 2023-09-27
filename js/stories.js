"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let loggedIn = Boolean(currentUser);
  let showMyStories = Boolean($userStories.is(":visible"));

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${showMyStories ? trashHTML() : ""}
        ${loggedIn ? heartHTML(story, currentUser) : ""}
        <div class="story-content">
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submit a story from the story submission form */
async function submitStory(e){
  console.debug('submitStory');
  e.preventDefault();
  const author = $('#submission-author').val();
  const title = $('#submission-title').val();
  const url = $('#submission-url').val();
  
  const newStory = await storyList.addStory(currentUser, {title, author, url});
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);

  $submissionForm.trigger("reset");
  $submissionForm.slideUp(300);
}

$submissionForm.on('submit', submitStory);

/************************************************************************* */
/** Story favorites functionality */

//icon html
function heartHTML(story, user){
  const favBoolean = user.favorites.some(s => s.storyId === story.storyId);
  const favClass = favBoolean ? "fa-solid" : "fa-regular";
  return `<i class="${favClass} fa-heart"></i>`;
}

/**handler for favoriting/unfavoriting
  - adds/removes story from API and user favorites list
  - updates the heart icon */
  
async function setFavHandler(evt){
  const target = evt.target;
  const storyId = target.parentElement.id;
  const story = storyList.stories.find(s => s.storyId === storyId);
  
  if(target.classList.contains("fa-solid")){
    await currentUser.removeFavorite(story);
    target.classList.replace('fa-solid', 'fa-regular');
  } else {
    await currentUser.addFavorite(story);
    target.classList.replace('fa-regular', 'fa-solid');
  }
}

$storiesList.on('click', '.fa-heart', setFavHandler);

//populate favorites list on page
function favsMarkup(){
  const favList = currentUser.favorites;
  $favoritesList.empty();

  if(favList.length === 0){
    $favoritesList.html('<p>No favorites added!<p>');
  } else {
    favList.forEach(s => {
      const html = generateStoryMarkup(s);
      $favoritesList.append(html);
    });
  }
}

/************************************************************** */
/** Functions for User-created stories  */

//show list of user-created stories on page
function myStoryMarkup(){
  const myList = currentUser.ownStories;
  $userStories.empty();

  if(myList.length === 0){
    $userStories.html("<p>You haven't posted any stories!<p>");
  } else {
    myList.forEach(s => {
      const html = generateStoryMarkup(s);
      $userStories.append(html);
    });
  }
}

//generate delete-button HTML
function trashHTML(){
  return `<i class="fa-solid fa-trash"></i>`;
}

//click handler for delete icon - deletes user-created stories
async function deleteClickHandler(evt){
  const $target = $(evt.target);
  const $storyLi = $target.parent();
  const $storyId = $storyLi.attr("id");
  const story = currentUser.ownStories.find(s => s.storyId === $storyId);
  
  await storyList.deleteStory(currentUser, story);
  myStoryMarkup(); //update user stories list
}

$userStories.on('click', '.fa-trash', deleteClickHandler);