//! react
import { Route, Switch } from "react-router";

//! components
import CreatePost from "components/pages/Posts/CreatePost";
import NotFound from "components/pages/NotFound";

const CreateRoutes = ({ match, location }) => (
  <Switch location={location}>
    <Route path={`${match.path}/style`} component={CreatePost} exact />
    <Route component={NotFound} />
  </Switch>
);

export default CreateRoutes;
