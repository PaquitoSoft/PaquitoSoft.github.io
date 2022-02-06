---
title: "Ractive.js tutorial - Managing user's notes (5 of 6)"
creationDate: "2015-08-02T11:03:31.081Z"
keywords: tutorial, javascript, ractive, ractivejs
status: published
---

(_Previous step: [Loading user info](/post/ractive-js-tutorial-loading-user-info)_)

Now we want to add to our little application the ability to create and delete notes for the users we can already see.
We will have a collection of notes for every user.

We need somewhere to store that notes and, for this tutorial, we'll use [Firebase](https://www.firebase.com/) free plan service.
If you don't have an account, go and create one. Once you have it, create a new APP from your account page.
Now that you have your APP created, take note of its URL, as we'll be using it to integrate our application using [Firebase REST API](https://www.firebase.com/docs/rest/quickstart.html).
The URL should be something like this: https://ps-github-saver.firebaseio.com/.

First of all, we're going to populate our notes component, as right now it's empty.
We could just put all the code in the _notes-section_ component, but for the sake of modularity (it would also help with the testing), we will have another two components:

- add-note: a little component to handle notes creation.
- notes-list: a little component to show current notes and allow removing them.

<!-- more -->

Let's go for the sub-components:
**_root-folder_/app/views/user/add-note.html**
```html
<form on-submit="createNote">
	<div class="input-group">
		<input type="text" class="form-control" value="{{newNote}}" placeholder="Add new note..." />
		<span class="input-group-btn">
			<button class="btn btn-default" type="submit"> Add </button>
		</span>
	</div>
</form>
```

**_root-folder_/app/js/components/user/notes/add-note.js**
```javascript
import Ractive from 'ractive';
import User from '../../../models/user';
import Template from '../../../../views/user/notes/add-note.html';

var AddNote = Ractive.extend({
	isolated: true,
	template: Template,
	oninit: function() {
		this.on('createNote', (rEvent) => {
			rEvent.original.preventDefault();
			this.fire('AddUserNote', rEvent.context.newNote);
			this.set('newNote', '');
		});
	},
	data: {
		newNote: ''
	}
});

export default AddNote;
```

This component just shows an input with a button so we can type our note and proceed saving it.
The **createNote** proxy event just fires a custom event with the introduced note message.
This event will bubble up through all parent components so any of them (the right one) can handle it.

Now, the _notes-list_ component.
**_root-folder_/app/views/user/notes/notes-list.html**
```html
<ul class="list-group">
	{{#each notes}}
		<li class="list-group-item">
			<span>{{.}}</span>
			<span class="pull-right">
				<span class="glyphicon glyphicon-remove" on-click="deleteNote" style="cursor: pointer;"></span>
			</span>
		</li>
	{{/each}}
</ul>
```

**_root-folder_/app/js/components/user/notes/notes-list.js**
```javascript
import Ractive from 'ractive';
import Template from '../../../views/user/notes/notes-list.html';

var NotesList = Ractive.extend({
	isolated: true,
	template: Template,
	oninit() {
		this.on('deleteNote', (rEvent) => {
				this.fire('RemoveUserNote', rEvent.context);
		});
	}
});

export default NotesList;
```

In the **deleteNote** proxy event, we just fire a custom event with the message we want to delete.

Now we need to update our _notes-section_ component so it uses those new sub-components:
**_root-folder_/app/views/user/notes-section.html**
```html
<div>
	<h3> Notes </h3>
	<AddNote />
	<br/>
	<NotesList notes="{{notes}}" />
</div>
```
Note that we pass the notes list from the parent component to the _notes-list_ subcomponent.

**_root-folder_/app/js/components/user/notes-section.js**
```javascript
'use strict';

import Ractive from 'ractive';
import AddNote from './notes/add-note';
import NotesList from './notes/notes-list';
import template from '../../views/user/notes-section.html';

var NotesSection = Ractive.extend({
	isolated: true,
	template: template,
	components: {
		AddNote: AddNote,
		NotesList: NotesList
	}
});

export default NotesSection;
```

We just need to update our user page view to pass the notes collection to this section:
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
		<Notes notes="{{user.notes}}" />
	</div>
</div>
```

We have all the notes stuff set up, but it's not functional yet as no one is managing reading and saving data to _Firebase_.
I think reading should be done in the **findByUsername** function from the user model object, so when the user page gets loaded, we have all its needed information.
On the other hand, creating and removing notes should be done from the user page component through the user model object. The user page component is the component who knows which user we're diplaying, so it will be the one listening to sub-component custom events.

Let's begin by reading user's notes.
**_root-folder_/app/js/models/user.js**
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

	static findByName(username) {
		let userProfileUrl = `${GITHUB_BASE_URL}/users/${username}`,
			userReposUrl = `${GITHUB_BASE_URL}/users/${username}/repos`,
			userNotesUrl = `${FIREBASE_BASE_URL}/${username.toLowerCase()}.json`;

		let result = new Promise((resolve, reject) => {
			Promise.all([
				ajax.getJson(userProfileUrl),
				ajax.getJson(userReposUrl),
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

We just need to declare the URL for the user's notes in our Firebase project and add another _getJson_ promise to our group.

Now we handle notes creation (in our user page component) so we can see anything in the notes list.
**_root-folder_/app/js/components/user-page.js**:
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

		// *.*, *.AddUserNote, AddNote.*, AddNote.AddUserNote
		this.on('*.AddUserNote', (newNote) => {
			console.log('UserPage::createNote# Adding new note to user:', this.get('user').profile.login);
			this.get('user').addNote(newNote);
		});
	}
});
UserPage._name = 'UserPage';

export default UserPage;
```

The custom events fired from components get their names namespaced. The final event name is built beginning with the name of the component where it was generated, followed by a dot and the name you used when firing the event.
When you register to events, you have the chance to use a wildcard both for the name of the component as well as the name of the event (see the comment above the event handler).

We now need to implement the **addNote** function in the user model.
**_root-folder_/app/js/models/user.js**
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

	static findByName(username) {
		let userProfileUrl = `${GITHUB_BASE_URL}/users/${username}`,
			userReposUrl = `${GITHUB_BASE_URL}/users/${username}/repos`,
			userNotesUrl = `${FIREBASE_BASE_URL}/${username.toLowerCase()}.json`;

		let result = new Promise((resolve, reject) => {
			Promise.all([
				ajax.getJson(userProfileUrl),
				ajax.getJson(userReposUrl),
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

Here we're adding the new notes to the users note's list so it get updated inmediatly and Ractive will update the view to reflect this change before the note is actually persisted.
Then, we call a new ajax pluging's function (_putJson_) to save the note in Firebase.

Most of the time, save operation will work, so I prefer to not wait for the back-end response so the user feels our application is blazing fast.
In real world applications we would (for example) implement a mechanism so, if the operation fails, we warn the user and we undo the operation.

Let's add the **putJson** function to our ajax component:
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
	return res.json();
}

export function getJson(url, options = {cache: false}) {
	return fetch(url)
		.then(checkResponseStatus)
		.then(parseJson);
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

If you reload the application in your browser right now, you should be able to save notes.

The last step is to add notes removing functionality.
We will follow the same pattern: fire a custom event from the sub-component (_notes-list_) and handle it from the user page through user model.
When we created the _notes-list_ component, we already configured the view and the behavior to fire that event, so we just need to update the user page and the user model:
**_root-folder_/app/js/components/user-page.js** (_add 'RemoveUserNote' event handler_)
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

		// *.*, *.AddUserNote, AddNote.*, AddNote.AddUserNote
		this.on('*.AddUserNote', (newNote) => {
			console.log('UserPage::createNote# Adding new note to user:', this.get('user').profile.login);
			this.get('user').addNote(newNote);
		});

		this.on('*.RemoveUserNote', (note) => {
			this.get('user').removeNote(note);
		});
	}
});
UserPage._name = 'UserPage';

export default UserPage;
```

**_root-folder_/app/js/models/user.js** (_add 'removeNote' function_)
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
				ajax.getJson(userProfileUrl),
				ajax.getJson(userReposUrl),
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

So, this is it.
You have used some of the main parts of Ractive along the way, but it has much more than this to offer.
I strongly recommend to (first) follow the [official tutorials](http://learn.ractivejs.org/hello-world/1/) and (second) to read its [documentation](http://docs.ractivejs.org/latest/get-started).

We have some things we can improve with little effort in our application that we will accomplish in the last step of the tutorial.

---

You can check the source code in [this GitHub repo](https://github.com/PaquitoSoft/notetaker-ractive).

---

Previous post: [Loading user info](/post/ractive-js-tutorial-loading-user-info)
Next post: [The final touch](/post/ractive-js-tutorial-the-final-touch)

---

