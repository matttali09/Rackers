import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import API from '../utils/API';

class Signup extends Component {
	state = {
		username: '',
		name: '',
		password: '',
		confirmPassword: '', // not being used;
		redirectTo: null
	}
	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	handleSubmit = event => {
		// console.log('sign-up handleSubmit, username: ')
		// console.log(this.state.username)
		event.preventDefault()
		const formData = {
			username: this.state.username,
			name: this.state.name,
			password: this.state.password
		};
		//request to server to add a new username/password
		API.signUpUser(formData)
			.then(response => {
				console.log(response)
				if (!response.data.errmsg) {
					// console.log('successful signup')
					this.props.updateUser({
                        loggedIn: true,
                        username: response.data.username,
                    })
					this.setState({ //redirect to home page
						redirectTo: '/home'
					})
				} else {
					console.log('username already taken')
				}
			}).catch(error => {
				console.log('signup error: ')
				console.log(error)

			})
	}


	render() {
		if (this.state.redirectTo) {
			return <Redirect to={{ pathname: this.state.redirectTo }} />
		} else {
			return (
				<div className="container mainContent form-container">
				<center>
					<h6 className="center text-28"><i className="material-icons">account_box</i> Sign up </h6></center>
					<center>
					<form className="form-horizontal">
						<div className="form-group">
							<div className="col-1 col-ml-auto">
								<label className="form-label" htmlFor="username">Username</label>
							</div>
							<div className="col-3 col-mr-auto">
								<input className="form-input"
									type="text"
									id="username"
									name="username"
									placeholder="Username"
									value={this.state.username}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-1 col-ml-auto">
								<label className="form-label" htmlFor="name">Name</label>
							</div>
							<div className="col-3 col-mr-auto">
								<input className="form-input"
									type="text"
									id="name"
									name="name"
									placeholder="name"
									value={this.state.name}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-1 col-ml-auto">
								<label className="form-label" htmlFor="password">Password: </label>
							</div>
							<div className="col-3 col-mr-auto">
								<input className="form-input"
									placeholder="password"
									type="password"
									name="password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<div className="form-group ">
							<div className="col-7"></div>
							<button
								className="btn btn-primary col-1 col-mr-auto"
								onClick={this.handleSubmit}
								type="submit"
							>Sign up</button>
						</div>
					</form>
					</center>
				</div>

			)
		}
	}
}
export default Signup
