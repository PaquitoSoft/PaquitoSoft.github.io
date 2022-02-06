---
title: "Ractive.js tutorial - Loading user info (4 of 6)"
creationDate: "2015-08-01T19:08:30.642Z"
keywords: tutorial, javascript, ractive, ractivejs
status: published
---

(_Previous step_: [Routing](/post/ractive-js-tutorial-routing))

Rigth now our page shows nothing but some labels.
The next step is to allow our users to search for a GitHub user and, if it's found, show his info in the specific page.

We will be requesting data to the [GitHub REST API](https://developer.github.com/v3/).
These are the endpoints we'll be hitting:

- https://api.github.com/users/{username}: Get user main info
- https://api.github.com/users/{username}/repos: Get user's repositories data

## Polyfills
To implement third party integration, we will be usign two new _ES2015_ APIs which are not already arrived to all browsers, so we need to include some polyfills in our application for them: [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

We will need to update our **webpack** configuration to include in our JS bundle these polyfills.

First, we need to install the polyfills and a couple of _webpack_ plugins:
```
$ npm install es6-promise whatwg-fetch --save
$ npm install imports-loader exports-loader --save-dev
```

<!-- more -->

Now, we update the _webpack_ configuration file:
```javascript
var webpack = require('webpack');

module.exports = {
	entry: './app/js/app.js',
	output: {
		filename: 'app/js/dist/bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel'
			},
			{
				test: /\\.html$/,
				loader: 'raw'
			}
		]
	},
	// This is to load polyfills (http://mts.io/2015/04/08/webpack-shims-polyfills/)
	plugins: [
		new webpack.ProvidePlugin({
			fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
			'es6-promise': 'es6-promise'
		})
	]
};
```

## Search user component

Before we make any request, we must update our _SearchUser_ component to handle username submission and navigate to user page.
Just update its _searchUser_ [proxy event](http://docs.ractivejs.org/latest/proxy-events) to get the username introduced by our user and try to navigate to the corresponding URL.
**_root-folder_/app/js/components/layout/search-user.js**
```javascript
import Ractive from 'ractive';
import Template from '../../../views/layout/search-user.html';
import * as router from '../../plugins/router';

var SearchGithub = Ractive.extend({
	isolated: true,
	template: Template,

	oninit() {
		this.on('searchUser', (rEvent) => {
			rEvent.original.preventDefault();
			router.navTo(`/user/${rEvent.context.query}`);
			this.set('query', '');
		});
	},

	data: {
			query: ''
	}
});

export default SearchGithub;
```

We've just imported the router plugin and configured the _serachUser_ handler to call plugin's navigation function passing the URL we want to visit (note the [string interpolation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings) to build the URL).

Now, when we type a username and submit the form, our router will call our '/user/:username' URL handler (defined in our _/app/js/config/routes.js_ file).
We need to update that handler to perform our action, in this case, load user's info and repos data.

## Ajax plugin

Instead of implement all the logic to fetch user related data in the route handler, we'll be using several objects to separete concerns.
In one hand, we'll have a plugin to deal with _AJAX_ request (we'll use the new, in progress, [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)). On the other hand we'll have a model object to represent a user so it will have all the logic related with users operations.

Let's first create the ajax plugin:
**_root-folder_/app/js/plugins/ajax.js**
```javascript
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

export function getJson(url) {
	return fetch(url)
		.then(checkResponseStatus)
		.then(parseJson);
}
```

Ok, this file exports a _getJson_ function which allows to fetch JSON data and return a JS object.

The _fetch_ function returns a promise which will get a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object as response.
We chain that promise with another one which checks the response status and another one to extract the data from the json response.
You must remember something very important when using _fetch_ function: if the endpoint responds with an error (for instance, a 4XX or 5XX response status code), the _fetch_ function will not invoke the _reject_ part of the promise it creates. That's why we need to first check for the status code of the response, before parsing its body.
Personally, I don't like this behavior and I hope this could change before closing this API specification.

## User model

Next, we create our user _model_, where we encapsulate users state and behavior.
**_root-folder_/app/js/models/user.js**
```javascript
import * as ajax from '../plugins/ajax';

const GITHUB_BASE_URL = 'https://api.github.com';

class User {
	
	constructor(profile, repos, notes) {
		this.profile = profile;
		this.repos = repos;
		this.notes = notes || []; // Default parameters values are only valid for undefined ones
	}

	static findByName(username) {
		let userProfileUrl = `${GITHUB_BASE_URL}/users/${username}`,
			userReposUrl = `${GITHUB_BASE_URL}/users/${username}/repos`;

		let result = new Promise((resolve, reject) => {
				Promise.all([
					ajax.getJson(userProfileUrl),
				ajax.getJson(userReposUrl),
			])
			.then(values => {
					resolve(new User(values[0], values[1]));
			})
			.catch(reject);
		});

		return result;
	}
}

export default User;
```

## Route handling

This is a _ES2015_ class with its _constructor_ function that gets invoked when we create a new instance and a _static_ function which allows to call it without creating a new instance.
Since our _ajax_ plugin uses the [_fetch_](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API and it returns promises, here we use the [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) function which allows to group several promises and get notified when all of them have completed (_or when one of them has failed_).

Now we need to update our routing configuration so that when the user page URL gets requested, we use this user model object to fetch needed data.
**_root-folder_/app/js/config/routes.js**
```javascript
'use strict';

import router from '../plugins/router';
import HomePage from '../components/home-page';
import UserPage from '../components/user-page';
import UserModel from '../models/user';

var routes = new Map();

routes.set('/', (context, next) => {
	next(null, HomePage);
});

routes.set('/user/:username', (context, next) => {
	UserModel.findByName(context.params.username)
	.then((user) => {
			next(null, UserPage, {
				user: user
		});
	})
	.catch((err) => {
			next(err);
	});
});

export default routes;
```

We get the username from the context parameter and use it to call the user model _findByName_ function so we get user's instance model object.
We then call _next_ so the control gets to the _App_ instance, which updates the _componentName_ (page to be shown) and the request data.
Just to remember...
**_root-folder_/app/js/app.js**
```javascript
...
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
...
```

Now we need to modify our user page component so, when the request data get updated, it updates its _user_ data attribute so the presentation show the new data.
**_root-folder_/app/js/components/user-page.js**
```javascript
import Ractive from 'ractive';
import Template from '../../views/user-page.html';
import UserProfile from './user/profile-section';
import Repos from './user/repos-section';
import Notes from './user/notes-section';

var UserPage = Ractive.components.UserPage = Ractive.extend({
	template: Template,
	components: {
		UserProfile: UserProfile,
		Repos: Repos,
		Notes: Notes
	},
	oninit() {
		this.observe('req', (request) => {
			this.set('user', request.body.user);
		});
	}
});
UserPage._name = 'UserPage';

export default UserPage;
```

When the page component is initialized, it begins observing for changes in the _req_ data context attribute (which is handled by the _App_ instance).
As we didn't set pages objects as isolated, they will get notified when that attribute gets updated.

If you try to search for a user right now, you won't see any data in your browser, but you won't see any error neither. This is because there's something missing.
Remember pages components are the only ones _non isolated_, so we need to pass the right user's data to its reusable components.
We need to update our user's page view:
**_root-folder_/app/views/user-page.html**
```html
<div class="row">
	<div class="col-md-4">
		<UserProfile profile="{{user.profile}}" />
	</div>
	<div class="col-md-4">
		<Repos repos="{{user.repos}}" />
	</div>
	<div class="col-md-4">
		<Notes />
	</div>
</div>
```

Now, if you load the app in your browser and search for a user, you must see his profile data and repos.
![](/content/images/2015/08/ractive-tutorial-08.png)

---

You can check the source code in [this GitHub repo](https://github.com/PaquitoSoft/notetaker-ractive).

---

Previous post: [Routing](/post/ractive-js-tutorial-routing)
Next post: [Managing user's notes](/post/ractive-js-tutorial-managing-users-notes)

---

