//! react
import { Route, Switch } from "react-router";

//! components
import Home from "components/pages/Home";
import Profile from "components/pages/Profile";
import NotFound from "components/pages/NotFound";
//! routes
import CreateRoutes from "./CreateRoutes";
import AccountsRoutes from "./AccountsRoutes";

const MainRoutes = ({ match, location }) => (
  <Switch location={location}>
    {/* Home */}
    <Route path={`${match.path}`} component={Home} exact />
    {/* Profile */}
    <Route path={`${match.path}:userid`} component={Profile} exact />
    <Route path={`${match.path}:userid/saved`} component={Profile} exact />
    {/* Post / Story / Etc */}
    <Route path="/create" component={CreateRoutes} />

    {/* Account Settings */}
    <Route path="/accounts" component={AccountsRoutes} />

    <Route component={NotFound} />
  </Switch>
);

export default MainRoutes;
