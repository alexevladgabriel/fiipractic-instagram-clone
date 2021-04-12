//! assets
import PhoneImage from "assets/images/phone.png";
import Photo from "assets/images/photo.jpg";
import Wordmark from "assets/images/wordmark.svg";
import FacebookSquare from "assets/images/facebook_square.png";

//! default
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

//! store
import firebase, { auth, db } from "utils/firebase";
import { useStoreActions, useStoreState } from "easy-peasy";

//! forms
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

//! styles
import styled from "styled-components";
import tw from "twin.macro";

const Wrapper = styled.div`
  ${tw`flex h-full justify-center content-center`}
`;

const ImageContainer = styled.div`
  background-image: url(${PhoneImage});
  background-position: 0 0;
  background-size: 454px 618px;
  flex-basis: 454px;
  height: 618px;

  ${tw`relative self-center bg-no-repeat`}
`;

const PhoneImg = styled.img`
  ${tw`absolute`}
  top: 96px;
  left: 147px;
  width: 247px;
`;

const LoginContainer = styled.div`
  border: 1px solid;
  width: 300px;
  ${tw`flex flex-col self-center bg-black h-auto border-insta-gray p-6`}
`;

const LogoImg = styled.img`
  ${tw`h-20 mb-6 text-white`}
`;

const LoginForm = styled(Form)`
  ${tw`flex flex-col`}
`;

const Input = styled(Field)`
  border: 1px solid;
  ${tw`bg-insta-dark mb-2 p-4 h-10 border-insta-gray text-insta-gray text-xs`}
  ::placeholder {
    ${tw`text-insta-lightgray`}
  }
`;

const LoginButton = styled.button`
  background-color: #002d4a;
  ${tw`w-full font-semibold text-white p-1 mt-1 rounded-sm`};
`;

const ProviderWrapper = styled.div`
  ${tw`mt-4 flex flex-row items-center justify-center`}
`;
const ProviderLine = styled.div`
  height: 1px;
  background-color: #262626;
  ${tw`flex-grow flex-shrink`}
  ${(props) => props.left && `margin-right: 20px`}
  ${(props) => props.right && `margin-left: 20px`}
`;
const ProviderText = styled.span`
  ${tw`text-insta-lightgray uppercase text-xs`}
`;

//! FORMIK
const FormSchema = Yup.object().shape({
  username: Yup.string().required("Please enter a valid username or email"),
  password: Yup.string().required("A password is required"),
});

const Login = () => {
  const history = useHistory();
  const [error, setError] = useState("");

  const formRef = useRef();

  const user = useStoreState((state) => state.auth.user);
  const setUser = useStoreActions((action) => action.auth.setUser);
  const setDetails = useStoreActions((action) => action.auth.setDetails);

  const handleLogin = ({ username, password }) => {
    auth
      .signInWithEmailAndPassword(username, password)
      .then(async (authUser) => {
        setUser(authUser.user);
        history.push("/");
      })
      .catch((err) => setError(err.message));
  };

  const handleFacebook = () => {
    var provider = new firebase.auth.FacebookAuthProvider();

    provider.addScope("email");
    firebase.auth().useDeviceLanguage();

    provider.setCustomParameters({
      display: "popup",
    });

    auth
      .signInWithPopup(provider)
      .then(async ({ user }) => {
        const username = user.displayName
          .split("-")
          .join("")
          .split(" ")
          .join("")
          .toLowerCase();

        db.collection("users")
          .where("email", "==", user.email)
          .get()
          .then((res) => {
            if (res.size) {
              res.forEach((doc) => {
                console.log(doc.data());
                setDetails(doc.data());
              });
            } else {
              const details = {
                name: user.displayName,
                username,
                photoUrl: user.photoURL ?? "",
                siteUrl: "",
                description: "",
                email: user.email,
                phoneNumber: user.phoneNumber ?? "",
                gender: "",
              };
              db.collection("users").add(details);
              setDetails(details);
            }
          });

        setUser(user);
        history.push("/");
      })
      .catch((err) => {
        setError(err.message);
        //var errorCode = err.code;
        //var email = err.email;
        //var credential = err.credential;
      });
  };

  useEffect(() => {
    user && history.push("/");
  }, [user, history]);

  return (
    <Wrapper>
      <ImageContainer>
        <PhoneImg src={Photo} alt={"1"} />
      </ImageContainer>
      <div className="flex flex-col self-center">
        <LoginContainer>
          <LogoImg src={Wordmark} alt="" />
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={FormSchema}
            onSubmit={(values) => handleLogin(values)}
            innerRef={formRef}
          >
            <LoginForm>
              <Input
                id="username"
                name="username"
                placeholder="E-mail or Username"
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
              <LoginButton type="submit">Login</LoginButton>
              {error.length > 0 ? (
                <p className="text-red-500 mt-4">{error}</p>
              ) : (
                ""
              )}
            </LoginForm>
          </Formik>
          <ProviderWrapper>
            <ProviderLine left />
            <ProviderText>Or</ProviderText>
            <ProviderLine right />
          </ProviderWrapper>
          <button
            className="flex flex-row text-facebook justify-center mt-6"
            onClick={handleFacebook}
          >
            <img
              className="w-5 mr-2 fill-current text-facebook"
              src={FacebookSquare}
              alt="facebook-square"
            />
            Login with Facebook
          </button>
          <Link
            onClick={() => {
              //! ceva rapid de ora 11:13 PM - 12.04.2021
              setError("Please be sure, you complete the email/username field");
              if (formRef.current.values.username.length > 0) {
                auth.sendPasswordResetEmail(formRef.current.values.username);
                setError("A email was sent to your address");
              }
            }}
            className="text-xs text-white text-center mt-5 -mb-1"
          >
            Forgot password?
          </Link>
        </LoginContainer>
        <LoginContainer className="mt-2 w-full text-white text-center">
          <Link to={"register"} className="text-blue-500">
            Create an account
          </Link>
        </LoginContainer>
      </div>
    </Wrapper>
  );
};

export default Login;
