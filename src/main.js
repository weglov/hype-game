import Vue from 'vue';
import App from './components/App.vue';
import firebase from 'firebase';
import User from './user.js';
import auth from './auth.js';
import createGame from './game.js';
import store from 'store';

window.store = store; // debug

import './assets/css/app.scss';

const initApp = () => {	
	auth();

	store.section('loader').show();
	store.section('sign-in').hide();
	store.section('app').hide();

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			console.log(user);
			store.user = new User(user);
			store.section('app').show();

			store.game = createGame();
			store.section('sign-in').hide();
			store.section('loader').hide();
			store.section('sign-in').remove();
			store.section('loader').remove();
			new Vue({ el: '#control-panel', render: h => h(App) });
		} else {
			store.user = {};

			store.section('loader').hide();
			store.section('app').hide();
			store.section('sign-in').show();
		}
	}, function(error) {
		console.log(error);
	});
};


window.addEventListener('load', initApp);