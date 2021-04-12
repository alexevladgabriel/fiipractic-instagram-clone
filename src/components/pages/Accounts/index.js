//! react router
import { NavLink, Route, Switch } from "react-router-dom";

//! components
import EditAccount from "./Components/EditAccount";
import ChangePassword from "./Components/ChangePassword";

//! styles
import styled from "styled-components";
import tw from "twin.macro";

const StyledWrapper = styled.div``;
const StyledTable = styled.div`
  height: 800px;
  ${tw`flex justify-center mt-8 text-white`}
`;

const StyledTableLeft = styled.div`
  width: 250px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  ${tw`border-insta-gray bg-black`}
`;
const StyledTableRight = styled.div`
  border: 1px solid;
  width: 700px;
  ${tw`border-insta-gray bg-black`}
`;

const StyledSideBar = styled.ul``;
const StyledLink = styled(NavLink)`
  border-left: 2px solid black;
  padding: 16px 16px 16px 30px;
  :hover {
    border-left: 2px solid;
    ${tw`text-white border-insta-gray bg-insta-dark`};
  }
  ${tw`block text-base font-medium`}
`;

const routesList = [
  {
    name: "Edit Profile",
    path: "/accounts/edit",
    component: EditAccount,
  },
  {
    name: "Change Password",
    path: "/accounts/password/change",
    component: ChangePassword,
  },
];

const StyledNavLink = ({ to, children }) => (
  <li>
    <StyledLink
      activeStyle={{ borderLeft: "2px solid white", fontWeight: 600 }}
      to={`${to}`}
    >
      {children}
    </StyledLink>
  </li>
);

const AccountsIndex = () => {
  return (
    <StyledWrapper>
      <StyledTable>
        <StyledTableLeft>
          <StyledSideBar>
            {routesList.map((route, index) => (
              <StyledNavLink key={index} to={`${route.path}`}>
                {route.name}
              </StyledNavLink>
            ))}
          </StyledSideBar>
        </StyledTableLeft>
        <StyledTableRight>
          <Switch>
            {routesList.map((route, index) => (
              <Route
                key={index}
                path={`${route.path}`}
                component={route.component}
                exact
              />
            ))}
          </Switch>
        </StyledTableRight>
      </StyledTable>
    </StyledWrapper>
  );
};

export default AccountsIndex;
