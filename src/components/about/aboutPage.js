"use strict";

var React = require('react');

var About = React.createClass({
	render: function() {
		return (
			<div>
				<h1>About</h1>
				<p>
					This app uses following techs:
					<ul>
						<li>React</li>
						<li>React flux</li>
						<li>flux</li>
						<li>Node</li>
						<li>Gulp</li>
						<li>Brosewrify</li>
						<li>Bootstrap</li>
					</ul>
				</p>
			</div>
		);
	}
});

module.exports = About;