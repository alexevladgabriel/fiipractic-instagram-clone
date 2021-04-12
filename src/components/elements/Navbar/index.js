import React from "react";
//! assets
import Wordmark from "assets/images/wordmark-white.png";

//! components
import DropdownMenu from "./Dropdown";
import { HomeIcon, MessagesIcon, ExploreIcon, HeartIcon } from "./Icons";

//! react router
import { NavLink, useHistory, useParams } from "react-router-dom";

//! store
//import { useStoreState } from "easy-peasy";

//! styles
import styled from "styled-components";
import tw from "twin.macro";
import Search from "../Search";

const Container = styled.div`
  border-bottom: 1px solid;
  ${tw`flex flex-row justify-evenly items-center p-2 bg-black border-insta-gray text-white`}
`;

const Logo = styled.img`
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  margin-top: 7px;
`;

// const Search = styled.input`
//   border: 1px solid;
//   padding: 2px 34px;
//   ${tw`ml-8 bg-insta-dark text-center border-insta-gray rounded text-white`}
// `;

const ListContainer = styled.ul`
  ${tw`flex flex-row space-x-6`}
`;

const ListItem = styled.li``;

const StyledNavLink = ({ to, children, activeClassName, blocked = false }) => (
  <ListItem>
    <NavLink
      className={blocked && "cursor-not-allowed"}
      activeClassName={activeClassName}
      to={`${to}`}
      onClick={blocked && ((e) => e.preventDefault())}
    >
      {children}
    </NavLink>
  </ListItem>
);

const routeList = [
  {
    name: "Home",
    path: "/",
    icon: HomeIcon,
    active: false,
    blocked: false,
  },
  {
    name: "Inbox",
    path: "/direct/inbox",
    icon: MessagesIcon,
    active: false,
    blocked: true,
  },
  {
    name: "Explore",
    path: "/explore",
    icon: ExploreIcon,
    active: false,
    blocked: true,
  },
  {
    name: "Accounts Activity",
    path: "/accounts/activity",
    icon: HeartIcon,
    active: false,
    blocked: true,
  },
];

const Navbar = () => {
  const history = useHistory();
  const renderComponent = (icon, active) => {
    return React.createElement(icon, { active: active });
  };

  const [routes, setRoutes] = React.useState(routeList);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    // history.location.pathname === routes[0].path
    routes.map(async (route) =>
      route.path === history.location.pathname
        ? (route.active = true)
        : (route.active = false)
    );
    //console.log(routes);
    setRoutes(routes);
  }, [setRoutes, history.location.pathname]);
  return (
    <Container>
      <NavLink to="/">
        <Logo src={Wordmark} alt="Instagram Logo" />
      </NavLink>
      <Search />
      <ListContainer>
        {routes.map(({ name, path, icon, active, blocked }) => (
          <StyledNavLink
            key={name}
            activeClassName="test"
            to={path}
            blocked={blocked}
          >
            {renderComponent(icon, active)}
          </StyledNavLink>
        ))}
        <ListItem>
          <DropdownMenu />
        </ListItem>
      </ListContainer>
    </Container>
  );
};
export default Navbar;
