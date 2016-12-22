import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

const Header = styled.header`
	position: relative;
	min-height: 50px;
	margin-bottom: 20px;
	border: 1px solid transparent;

	background-color: #222;
  border-color: #080808;
`;

const Container = styled.div`
	padding-right: 15px;
	padding-left: 15px;
	margin-right: auto;
	margin-left: auto;

	&:before {
		display: table;
    content: "";
	}
	&:after {
		content: "";
		display: table;
		clear: both;
	}
`;

const NavHeader = styled.div`
	&:before {
		display: table;
    content: " ";
	}
	&:after {
		content: "";
		display: table;
		clear: both;
	}
`;

const Navigation = styled.div`
	border-color: #101010;

	width: auto;
	display: block!important;
	height: auto!important;
	padding-bottom: 0;
	overflow: visible!important;
`;

const ListItem = styled.ul`
	float: left;
  margin: 0;
	padding-left: 0;
	list-style: none;

	&:before {
		display: table;
    content: " ";
	}
	&:after {
		content: "";
		display: table;
		clear: both;
	}
`;

const Items = styled.li`
	float: left;
	position: relative;
	display: block;

	&:before {
		display: table;
    content: " ";
	}
	&:after {
		content: "";
		display: table;
		clear: both;
	}
`;

const StyledLink = styled(Link)`
	color: #9d9d9d;
	position: relative;
	display: block;
	padding-top: 15px;
	padding-bottom: 15px;
	font-family: Helvetica, Arial, sans-serif;
	text-decoration: none;

  &:hover {
    color: #ffffff;
		cursor: pointer;
  }
`;

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
				<Header>
					<Container>
						<NavHeader>
						</NavHeader>
						<Navigation>
							<ListItem>
								<Items>
									<StyledLink to='form'>Form</StyledLink>
								</Items>
							</ListItem>
						</Navigation>
					</Container>
				</Header>

				<Container>
					{this.props.children}
				</Container>
			</div>
    );
  }
}

export default App;
