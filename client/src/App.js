//react app (frontend)

import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Events from "./Pages/Events";
import Results from "./Pages/Results";
import PageNotFound from "./Pages/PageNotFound";
import 'bootstrap/dist/css/bootstrap.min.css';
import VotingOption from "./Pages/votingOption";
import ResultsView from "./Pages/ResultsView";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/profile/:id" component={Profile} />
                <Route exact path="/events/:id" component={Events} />
                <Route exact path="/results/:id" component={Results} />
                <Route exact path="/votingOption/:id" component={VotingOption} />
                <Route exact path="/resultscheck/:id" component={ResultsView} />
                <Route exact path="*" component={PageNotFound} />
            </Switch>
        </Router>
    );
}

export default App;
