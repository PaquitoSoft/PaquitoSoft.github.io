---
slug: "ractive-js-tutorial-the-final-touch"
title: "Ractive.js tutorial - The final touch (6 of 6)"
creationDate: "2015-08-02T18:32:00.629Z"
keywords: tutorial, javascript, ractive, ractivejs
status: published
---

(_Previous step: [Managing user's notes](/post/ractive-js-tutorial-managing-users-notes)_)

There are some little things we should improve in our application:

- [Home flickering](#home-flickering)
- [Show errors](#show-errors)
- [Cache ajax requests](#cache-ajax)

## Home flickering
Right now, if you reload the page with a user page URL in the browser, you first see the home page and then you're redirected to the user page.
When we load the application and the router ([PageJS](https://github.com/visionmedia/page.js)) gets initialized, it checks the URL and invokes the corresponding route handler (you can disable this behaviour if you want to by using the [_dispatch_ attribute](https://github.com/visionmedia/page.js#pageoptions)).
As we have configured the default view to be 'HomePage' in our _App_ instance, it will get loaded before the router does its magic.

My solution for this is to create an empty view in our _App_ and set it to be the default view, so we won't see any sub-view until the router invokes the right route handler and the right view is promoted to be shown.

<!-- more -->

**_root-folder_/app/js/app.js** (_include a default empty view_)
```javascript
import Ractive from 'ractive';
import template from '../views/app.html';

import * as RouterPlugin from './plugins/router';
import routesConfiguration from './config/routes';

import RouterComponent from './components/layout/router';
import SearchUserComponent from './components/layout/search-user';
import HomePageComponent from './components/home-page';
import UserPageComponent from './components/user-page'

let App = new Ractive({
	el: '#app',
	template: template,
	components: {
		SearchUser: SearchUserComponent,
		Router: RouterComponent,
		EmptyPage: Ractive.extend({ template: '' })
	},
	data: {
		componentName: 'EmptyPage'
	},
	oninit() {
		RouterPlugin.init(routesConfiguration, this.onNavigation.bind(this));
		console.log('App::oninit# Application initialized!');
	},
	onNavigation(error, navigationContext) {
		console.log('APP::onNavigation# Navigating to:', navigationContext.pageName, 'with context:', navigationContext);

		if (error) {
			console.warn('App::onNavigation# Error navigating:', error);
		} else {
			this.set({
				req: {
					params: navigationContext.params,
					body: navigationContext.state
				},
				componentName: navigationContext.pageName
			});
		}
	}
});

export default App;
```

## Show errors
Right now if you look for a user that doesn't exist in GitHub, you won't get notified. The error is only printed in the browser tools console.
We just need to add a little _html_ to our main application template and a little code to our _App_ instance to show the message.

**_root-folder_/app/views/app.html** (_add error message markup_)
```html
<div class="main-container">
	<nav class="navbar navbar-default" role="navigation">
		<div class="col-sm-1">
			<a href="/">
				<h3>Notetaker</h3>
			</a>
		</div>
		<div class="col-sm-7 col-sm-offset-1" style="margin-top: 15px;">
			<SearchUser placeholder="Type a GitHub username..." />
		</div>
	</nav>
	<div class="container">
		<Router componentName="{{componentName}}"/>
	</div>
	{{#errorMsg}}
		<div class="alert alert-danger alert-dismissible" style="position: absolute; top: 80px; right: 10px;" role="alert">
			<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<strong>Error:</strong> {{errorMsg}}
		</div>
	{{/errorMsg}}
</div>
```

**_root-folder_/app/js/app.js** (_add 'showAlert' function and use it from the routes handler)
```javascript
import Ractive from 'ractive';
import template from '../views/app.html';

import * as RouterPlugin from './plugins/router';
import routesConfiguration from './config/routes';

import RouterComponent from './components/layout/router';
import SearchUserComponent from './components/layout/search-user';
import HomePageComponent from './components/home-page';
import UserPageComponent from './components/user-page'

let App = new Ractive({
	el: '#app',
	template: template,
	components: {
		SearchUser: SearchUserComponent,
		Router: RouterComponent,
		EmptyPage: Ractive.extend({ template: '' })
	},
	data: {
		componentName: 'EmptyPage'
	},
	oninit() {
		RouterPlugin.init(routesConfiguration, this.onNavigation.bind(this));
		console.log('App::oninit# Application initialized!');
	},
	onNavigation(error, navigationContext) {
		console.log('APP::onNavigation# Navigating to:', navigationContext.pageName, 'with context:', navigationContext);

		if (error) {
			console.warn('App::onNavigation# Error navigating:', error);
			this.showAlert(error.displayMessage || error.message);
		} else {
			this.set({
				req: {
					params: navigationContext.params,
					body: navigationContext.state
				},
				componentName: navigationContext.pageName
			});
		}
	},
	showAlert(message) {
		this.set('errorMsg', message);
		setTimeout(() => {
			this.set('errorMsg', null);
		}, 2500);
	}
});

export default App;
```

## Cache ajax requests
The users info we're getting from GitHub doesn't change very often and, also, GitHub has [some limitations](https://developer.github.com/v3/#rate-limiting) on unauthorized requests you can make per hour.
It would be great to cache that info in the broswer (for example: using _localStorage_) so we avoid those limiations and the application reponds faster when asking for the same user info several times.
We will use the great [lscache](https://github.com/pamelafox/lscache) library so it handles _localStorage_ management and it allows us to set TTLs (_time to live_) on our stored values to get automatically invalidated.

On the one hand, we need to specify which request we want to cache. In our user model, we set the GitHub requests to be cached for one hour.

First we need to install the dependecy:
```
$ npm install lscache --save
```

**_root-folder_/app/js/models/user.js** (_set GitHub ajax request to be cached_)
```javascript
import * as ajax from '../plugins/ajax';

const GITHUB_BASE_URL = 'https://api.github.com';
const FIREBASE_BASE_URL = `https://ps-github-saver.firebaseio.com`;

class User {
	
	constructor(profile, repos, notes) {
		this.profile = profile;
		this.repos = repos;
		this.notes = notes || []; // Default parameters values are only valid for undefined ones
	}

	addNote(newNote) {
		this.notes.push(newNote);
		return ajax.putJson(`${FIREBASE_BASE_URL}/${this.profile.login.toLowerCase()}.json`, this.notes);
	}

	removeNote(note) {
		var index = this.notes.indexOf(note);
		if (index >= 0) {
				this.notes.splice(index, 1);
			return ajax.putJson(`${FIREBASE_BASE_URL}/${this.profile.login.toLowerCase()}.json`, this.notes);
		}
	}

	static findByName(username) {
		let userProfileUrl = `${GITHUB_BASE_URL}/users/${username}`,
			userReposUrl = `${GITHUB_BASE_URL}/users/${username}/repos`,
			userNotesUrl = `${FIREBASE_BASE_URL}/${username.toLowerCase()}.json`;

		let result = new Promise((resolve, reject) => {
			Promise.all([
				ajax.getJson(userProfileUrl, {cache: true, ttl: 60}), // TTL in minutes
				ajax.getJson(userReposUrl, {cache: true, ttl: 60}), // TTL in minutes
				ajax.getJson(userNotesUrl)
			])
			.then(values => {
				resolve(new User(values[0], values[1], values[2]));
			})
			.catch(reject);
		});

		return result;
	}
}

export default User;
```

Now we need to update our _ajax_ plugin to use _lscache_ library and deal with caching configuration:
**_root-folder_/js/app/plugins/ajax.js**
```javascript
import lscache from 'lscache';

function checkResponseStatus(res) {
	if (res.status < 400) {
		return res;
	} else {
		let error = new Error(res.statusText);
		error.statusCode = res.status;
		error.response = res;
		throw error;
	}
}

function parseJson(res) {
	return new Promise((resolve) => {
		res.json().then(data => {
			resolve({
				json: data,
				url: res.url
			});
		});
	});
}

function cacheResponse(shouldCache, ttl, key) {
	return (data) => {
		if (shouldCache) {
			console.log('Ajax::cacheResponse# Caching response with key:', key, 'for', ttl, 'minutes.');
			lscache.set(data.url, data.json, ttl); // Last parameter is TTL in minutes
		}
		return data.json;
	}
}

export function getJson(url, options = {cache: false}) {
	let data = lscache.get(url);
	if (data) {
		return Promise.resolve(data);
	} else {
		return fetch(url)
			.then(checkResponseStatus)
			.then(parseJson)
			.then(cacheResponse(options.cache, options.ttl, url));
	}
}

export function putJson(url, data) {
	return fetch(url, {
		method: 'put',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
			body: JSON.stringify(data)
		})
		.then(checkResponseStatus);
}
```

Now you can check with your browser tools that, if you load several times the same user, only the first one will issue request to GitHub.

---

You can check the source code in [this GitHub repo](https://github.com/PaquitoSoft/notetaker-ractive).

---

## Ending
First of all, I want to thank you for getting all the way of this long tutorial until the end.
I hope you found it insteresting and that you have learned something new that will be useful in the future.

I decided to write this tutorial not only because I want to spread the word about [Ractive.js](http://www.ractivejs.org/) (note that I'm not involved in the project at all; I'm only one of its users), but because in my carrer I have read many many tutorials that helped me to be a better developer and I wanted to give back the same to the community.

If you liked this tutorial, please talk about it in your favorite social network or to your collegues, and you would make my day if you drop me a line by e-mail (paquitosoftware at gmail.com) or in Twitter (@telemaco82).

---
