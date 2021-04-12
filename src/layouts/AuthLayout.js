import Header from "components/elements/Header";

const AuthLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default AuthLayout;
