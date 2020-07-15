import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import AdminPage from "./pages/AdminPage";
import CreateTutorialPage from "./pages/CreateTutorialPage";
import checkToken from "./utils/checkToken";
import { connect } from "react-redux";
import { setUser } from "./redux/user/actions";
import TutorialPage from "./pages/TutorialPage";
import UpdateTutorialPage from "./pages/UpdateTutorialPage";
import SavedTutorialsPage from "./pages/SavedTutorialsPage";
import TrackingUser from "./pages/TrackingUser";

class App extends Component {
    authorize = (Page) => {
        const { currentUser } = this.props;
        if (currentUser.userType === "admin") {
            return <Page />;
        }
        return <Redirect to='/' />;
    };

    authenticate = (Page) => {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            return <Page />;
        }
        return <Redirect to='/sign-in' />;
    };

    componentDidMount() {
        const { isValid, user } = checkToken();
        if (isValid) {
            this.props.setUser(user);
        }
    }
    render() {
        return (
            <Router>
                <Header />
                <Switch>
                    <Route exact path='/sign-up' component={SignUpPage} />
                    <Route exact path='/sign-in' component={SignInPage} />
                    <Route exact path='/tutorials/:tutorialId' component={TutorialPage} />
                    <Route exact path='/users/saved-tutorials' render={() => this.authenticate(SavedTutorialsPage)} />
                    <Route exact path='/admin/tutorials' render={() => this.authorize(AdminPage)} />
                    <Route
                        exact
                        path='/admin/tutorials/create-tutorial'
                        render={() => this.authorize(CreateTutorialPage)}
                    />
                    <Route
                        exact
                        path='/admin/tutorials/update-tutorial/:tutorialId'
                        render={() => this.authorize(UpdateTutorialPage)}
                    />
                    <Route exact path='/admin/tracking-users' render={() => this.authorize(TrackingUser)} />
                    <Route exact path='/' component={HomePage} />
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
    isAuthenticated: state.user.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
    setUser: (user) => dispatch(setUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
