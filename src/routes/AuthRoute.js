//! default
import React from "react";
import { Route, Redirect } from "react-router-dom";

//! store
import { useStoreState } from "easy-peasy";

//! components
import AuthLayout from "layouts/AuthLayout";

export default function PrivateRoute({ component: Component, ...rest }) {
  const user = useStoreState((state) => state.auth.user);
  return (
    <Route
      {...rest}
      render={(props) => {
        return user ? (
          <AuthLayout>
            <Component {...props} />
          </AuthLayout>
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}
