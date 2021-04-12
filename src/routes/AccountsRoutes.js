//! react
import { Route, Switch } from "react-router";

//! components
import AccountsIndex from "components/pages/Accounts";
import NotFound from "components/pages/NotFound";

const AccountsRoutes = ({ match, location }) => (
  <Switch location={location}>
    <Route path={`${match.path}/edit`} component={AccountsIndex} exact />
    <Route
      path={`${match.path}/password/change`}
      component={AccountsIndex}
      exact
    />
    <Route component={NotFound} />
  </Switch>
);

export default AccountsRoutes;
