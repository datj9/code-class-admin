import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import AdminPage from "./pages/AdminPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import checkToken from "./utils/checkToken";
import { connect } from "react-redux";
import { setUser } from "./redux/user/actions";
import UpdateArticle from "./pages/UpdateArticle";
import TrackingUser from "./pages/TrackingUser";
import CreateMentor from "./pages/CreateMentor";
import ManageMentor from "./pages/ManageMentor";

class App extends Component {
    authorize = (Page) => {
        const { currentUser } = this.props;
        if (currentUser.userType === "admin") {
            return <Page />;
        }
        return <SignInPage />;
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
                    <Route exact path='/' render={() => this.authorize(AdminPage)} />
                    <Route exact path='/sign-up' component={SignUpPage} />
                    <Route exact path='/create-article' render={() => this.authorize(CreateArticlePage)} />
                    <Route exact path='/update-article/:articleId' render={() => this.authorize(UpdateArticle)} />
                    <Route exact path='/create-mentor' render={() => this.authorize(CreateMentor)} />
                    <Route exact path='/manage-mentor' render={() => this.authorize(ManageMentor)} />
                    <Route exact path='/tracking-users' render={() => this.authorize(TrackingUser)} />
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
