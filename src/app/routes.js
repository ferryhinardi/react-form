import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/app';
import Form from './containers/FormContainer';

export default (
	<Route path="/" component={App}>
		<Route path="/form" component={Form} />
	</Route>
);
