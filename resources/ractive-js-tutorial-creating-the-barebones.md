---
title: "Ractive.js tutorial - Creating the barebones (2 of 6)"
creationDate: "2015-07-28T20:35:02.558Z"
keywords: tutorial, javascript, ractive, ractivejs
status: published
---

(_Previous step_: [Setting up your environment](/post/ractive-js-tutorial-setting-up-your-environment/))

Ok, so now that you have all ready to fly, let's check what we want to do.

The goal is to build a simple app that let us view [GitHub](https://github.com/) user's information and, also, to manage our own message notes for every user.
We will have a common layout with a static section (the one where you can search for users) and two subviews, having each one a different URL:

- Home page: will only contain a welcome message
- User profile page: will contain three sections for every user info group

<!-- more -->

This is the home page:
![Home page](/content/images/2015/08/ractive-tutorial-03.png)
<br>

This is the user page:
![User profile page](/content/images/2015/07/ractive-tutorial-04.png)

Our main layout will host the header and a dynamic section we will fill with the subsections depending on the URL and the user actions.

So, the first thing is to create our main _html_ layout.
Open the **index.html** file and populate it with this content:
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>Ractive Github notetaker</title>
		<link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.css">
	</head>

	<body>
		<div id="app"></div>

		<script src="dist/js/app-bundle.js"></script>
	</body>
</html>
```
This basic _html_ just loads [bootstrap](http://getbootstrap.com/) for styling, creates an empty _div_ where we will load our application content, and requests the _JS_ bundle which will contains all of our magic code.

The way Ractive works it that you create a new instance of its main object specifying the _html/handlebars_ template it will need to deal with, the place in the document it will fills, and the data it must manage (and display). Of course, there are a lot of other properties you can initialize instances with, but keep this idea by now.

Let's update our main _JS_ file with a _Ractive_ instance that will represent our application.
**_root-folder_/app/js/app.js**: 
```language-javascript
import Ractive from 'ractive';

let App = new Ractive({
	  el: '#app',
  template: '<input type="text" value="{{name}}"><p>Name: {{name}}</p>',
  data: {
	    name: 'Paquitosoft'
  }
});

export default App;
```

Before we go any further, we must install our first production dependency: [Ractive.js](http://www.ractivejs.org/)
```language
$ npm install ractive --save
```

Now, if you re/start your server (_npm start_), you will see a blank page with an input and a label with a text.
Note how changing the value from the input, the text besides de label gets updated.
This is because _Ractive data binding_, implemented just by linking the value of the input to the _name_ attribute of the Ractive instance _data_.

If you've ever used [Mustache](https://github.com/janl/mustache.js) or [Handlebars](http://handlebarsjs.com/) before, [_Ractive_ template system](http://docs.ractivejs.org/latest/templates) is very similar. It's an extension of _Mustache_ with some sugar to make your life easier.

Notice the **template** attribute we're passing in the Ractive instance initialization. It holds the contents of the template for the purpose of this little example, but we want to have that template in its own file for better organization.

Let's create a new folder for holding our templates and create the main application one.
**_root-folder_/app/js/views/app.html**
```html
<div class="main-container">
	<nav class="navbar navbar-default" role="navigation">
		<div class="col-sm-1">
			<a href="/">
				<h3>Notetaker</h3>
			</a>
		</div>
		<div class="col-sm-7 col-sm-offset-1" style="margin-top: 15px;">
            Here will be the search controls...
		</div>
	</nav>
	<div class="container">
        Here will be the main content of every route...
	</div>
</div>
```

In order to use this file in our application main file, we need to import it. But, as by default _webpack_ interprets all dependencies as _JS_, we need to configure it to understand our templates are only text and it doesn't need to process them.
We do this by configuring a new _webpack_ loader which allows to simple import the files contents as they are ([raw-plugin](https://github.com/webpack/raw-loader)).
**_root-folder_/webpack.config.js**
```language-javascript
module.exports = {
		entry: './app/js/app.js',
	output: {
			filename: './dist/js/app-bundle.js'
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
	}
};
```

Now we import the template in the _app_ file, re/start our main process (_npm start_) and check [http://localhost:8080]().
**_root-folder_/app/js/app.js**:
```language-javascript
import Ractive from 'ractive';
import template from './views/app.html';

let App = new Ractive({
	  el: '#app',
  template: template,
  data: {
	    name: 'Paquitosoft'
  }
});

export default App;
```
<br>

## Ractive components
On top of direct instances, Ractive allows us to use what they call [Components](http://docs.ractivejs.org/latest/components).
The idea behind this kind of objects is to allow you to create encapsulated components very much like [React](http://facebook.github.io/react/) does.
Once you declare and register them (can be globally or per instance/component), you can use it inside your templates as new _html_ entities.

To demonstrate how they work, we will create a new component to encapsulate the search functionality.
We begin by creating the template in a new file:
**_root-folder_/app/views/search-user.html**
```html
<div class="col-sm-12">
	<form on-submit="searchUser">
		<div class="form-group col-sm-7">
			<input type="text" class="form-control" value="{{query}}" autofocus placeholder="{{placeholder}}"/>
		</div>

		<div class="form-group col-sm-5">
			<button type="submit" class="btn btn-block btn-primary">Search Github</button>
		</div>
	</form>
</div>
```
Let's comment this template a little bit...

The **on-submit** attribute in the _form_ tag is a [Ractive proxy event](http://docs.ractivejs.org/latest/events-overview) declaration. Every time the user submits the form, the component managing this template will be notified (we'll see how to listen to that event in a moment).

The *input* tag has a data binding value with the **query** component data attribute. _Ractive_ will keep the sync. The same goes for the **placeholder**. 
While the first one is only used inside the component, we will provide the latter from the parent _App_ instance just to show how you can share data between them.

You must know that _components_, by defuault, inherit its parent data context. This search component will be used from the App main instance, meaning that App's data attributes are, by default, visible to the _search_ component.
Personally I don't like this kind of behavior by default as components get less reusable when they depend on some context not declared. I prefer to use them in _isolated_ model, where they create an own data attributes context  which you can pass specific parameters.

Let's create our component in a new file:
**_root-folder_/app/js/components/layout/search-user.js**
```language-javascript
import Ractive from 'ractive';
import Template from '../../../views/layout/search-user.html';

var SearchGithub = Ractive.extend({
		isolated: true,
	template: Template,

	oninit() {
			this.on('searchUser', (rEvent) => {
				rEvent.original.preventDefault();

			let username = rEvent.context.query;
			
			console.log('This is the user you want to look up:', username);
		});
	},

	data: {
			query: ''
	}
});

export default SearchGithub;
```

The way we create a _Ractive_ component is by executing its **extend** function, passing the attributes which configure the component:

- isolated: We set this attribute to false so a new independent data context it's created for this component.
- temaplate: Set the template we previously declared.
- oninit: This function will be executed everytime the component gets initialized (Check [this link](http://docs.ractivejs.org/latest/lifecycle-events) to review the info of all life-cycle events).
- data: Here we define the inner properties.

Also, in our _oninit_ handler we set up a listener for the **on-submit** event by listening to the custom event **searchUser**.
The handler receives an extension of the native browser event enhanced with some useful information (check the _Event arguments_ section of the [proxy events](http://docs.ractivejs.org/latest/proxy-events) docs to see the details).
We access the _original_ property where we find the native browser event just to prevent default behavior. Note that you could also get this by returning _false_ from this listener function, but that also stops event propagation.
The **context** attribute for the event holds a data reference to the context where the event took place. In this case is the _input_ tag, represented by an object with its data bindings.

So now that we have our component set up, let's use it from the App.
First we need to update the App markup:
**_root-folder_/app/views/app.html**
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
		Here will be the main content of every route...
	</div>
</div>
```
Take note about how we're providing some data to the component by providing a tag attribute (_placeholder_).

Second, we update our _App_ instance to tell it to use the _search-user_ component:
**_root-folder_/app/js/app.js**
```language-javascript
import Ractive from 'ractive';
import template from '../views/app.html';
import SearchUserComponent from './components/layout/search-user';

let App = new Ractive({
	  el: '#app',
  template: template,
  components: {
	  	SearchUser: SearchUserComponent
  }
});

export default App;
```
We've just imported the _search-user_ component and we set it as an _App_ component using its **components** attributes. You just need to configure an object with the _components_ you will use in your instance (or _component_) where the key is the name you will use for the _component_ in the template and the value will be the _component class_.

You can also register the components globally like this:
```language-javascript
Ractive.components.SearchUser = SearchUserComponent
```
The benefit is that all Ractive instances and _components_ will _see_ the component. 
The downside is that you loose visibility about which components your instance/component is using in the code.
This is just a personal choice, and I prefer being specific.

Ok, if you reload you browser now, you must see this picture:
![](/content/images/2015/07/ractive-tutorial-05.png)

The last step on this post is to also create a component for the main dynamic section representing the home page.
We will do this for the sake of modularity and to get ready for the next post about routing.
The template is very simple:
**_root-folder_/app/views/home-page.html**
```html
<h2 class="text-center">
	Search by Github username above
</h2>
```

The component is also trivial:
**_root-folder_/app/js/components/home-page.js**
```language-javascript
import Ractive from 'ractive';
import Template from '../../views/home-page.html';

var HomePage = Ractive.extend({
		template: Template
});

export default HomePage;
```

Now update App to use this new component:
**_root-folder_/app/views/app.html**
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
		<HomePage />
	</div>
</div>
```

**_root-folder_/app/js/app.js**
```language-javascript
import Ractive from 'ractive';
import template from '../views/app.html';
import SearchUserComponent from './components/layout/search-user';
import HomePageComponent from './components/home-page';

let App = new Ractive({
	  el: '#app',
  template: template,
  components: {
	  	SearchUser: SearchUserComponent,
  	HomePage: HomePageComponent
  }
});

export default App;
```


## Summary
- We now know what we want to build.
- We created the main App instance using _Ractive_.
- We configured [webpack](http://webpack.github.io/) to make it load our _html_ templates.
- We got some insights about this library and how it works: what components are, how to configure data bindings, how to listen to DOM events and how to handle data contexts. 
- We divided our little application in pieces both in terms of presentation (views) and behavior (components).

---

You can check the source code in [this GitHub repo](https://github.com/PaquitoSoft/notetaker-ractive).

---

Previous post: [Setting up your environment](/post/ractive-js-tutorial-setting-up-your-environment)
Next post: [Routing](/post/ractive-js-tutorial-routing)

---
