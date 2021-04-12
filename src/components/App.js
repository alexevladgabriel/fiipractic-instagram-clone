//! react
import { useState, useEffect } from "react";

//! react router
import { BrowserRouter, Route, Switch } from "react-router-dom";

//! components & layouts
import Home from "components/pages/Home";
import Profile from "components/pages/Profile";
import Login from "components/auth/Login";
import Register from "components/auth/Register";
import NotFound from "./pages/NotFound";

//! store & firebase
import { useStoreRehydrated } from "easy-peasy";
import { useStoreActions } from "easy-peasy";
import { auth, db } from "utils/firebase";

//! external routes
import MainRoutes from "routes/MainRoutes";
import AuthRoute from "routes/AuthRoute";
import CreateRoutes from "routes/CreateRoutes";
import AccountsRoutes from "routes/AccountsRoutes";

function WaitForStateRehydration({ children }) {
  const isRehydrated = useStoreRehydrated();
  return isRehydrated ? children : null;
}

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const setUser = useStoreActions((actions) => actions.auth.setUser);
  const setDetails = useStoreActions((actions) => actions.auth.setDetails);
  useEffect(() => {
    const subscribe = auth.onAuthStateChanged((user) => {
      user &&
        db
          .collection("users")
          .where("email", "==", user.email)
          .get()
          .then((res) =>
            res.forEach((doc) => {
              //! Mi-am dat seama ca am nevoie de docID in mai multe componente si e pont sa-l includ - 12.04.2021 - 01:17 PM
              setDetails({ id: doc.id, ...doc.data() });
            })
          );

      setUser(user);
      setDetails(null);
      setLoading(false);
    });
    return () => subscribe();
  }, [setUser, setDetails, setLoading]);
  return (
    <WaitForStateRehydration>
      <BrowserRouter>
        {!isLoading && (
          <Switch>
            {/* Guest Routes */}
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />

            {/* Auth Routes */}
            <AuthRoute path="/" component={MainRoutes} />

            {/* 404 - Not found */}
            <AuthRoute path={"*"} component={NotFound} />
          </Switch>
        )}
      </BrowserRouter>
    </WaitForStateRehydration>
  );
};

export default App;
