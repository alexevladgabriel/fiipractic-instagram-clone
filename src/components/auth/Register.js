//! assets
import Wordmark from "assets/images/wordmark.svg";

//! firebase
import { auth, db } from "utils/firebase";

//! default
import { useStoreState } from "easy-peasy";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

//! forms
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

//! styles
import styled from "styled-components";
import tw from "twin.macro";

const Wrapper = styled.div`
  ${tw`flex h-full justify-center content-center`}
`;

const RegisterContainer = styled.div`
  border: 1px solid;
  width: 300px;
  ${tw`flex flex-col self-center bg-black h-auto border-insta-gray p-6`}
`;

const RegisterImg = styled.img`
  ${tw`h-20 mb-6 text-white`}
`;

const RegisterForm = styled(Form)`
  ${tw`flex flex-col`}
`;

const Input = styled(Field)`
  border: 1px solid;
  ${tw`bg-insta-dark mb-2 p-4 h-10 border-insta-gray text-insta-gray text-xs`}
  ::placeholder {
    ${tw`text-insta-lightgray`}
  }
`;

const RegisterButton = styled.button`
  background-color: #002d4a;
  ${tw`w-full font-semibold text-white p-1 mt-1 rounded-sm`};
`;

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Please provide a full name"),
  username: Yup.string().required("Please provide a username"),
  email: Yup.string().email().required("Please provide a e-mail address"),
  password: Yup.string().required("A password is required"),
});

export default function Register() {
  const history = useHistory();
  const [error, setError] = useState("");

  const user = useStoreState((state) => state.auth.user);
  const handleRegister = ({ name, username, email, password }) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (authUser) => {
        await authUser.user.updateProfile({
          displayName: name,
        });
        const { email, photoURL } = authUser.user;
        await db.collection("users").add({
          name,
          username,
          photoUrl:
            photoURL ??
            "https://cdn130.picsart.com/318381621277201.jpg?type=webp&to=min&r=640",
          siteUrl: "",
          description: "",
          email,
          phoneNumber: "",
          gender: "",
        });

        history.push("/");
      })
      .catch((err) => setError(err.message));
  };
  useEffect(() => {
    user && history.push("/");
  }, [user, history]);
  return (
    <Wrapper>
      <div className="flex flex-col self-center">
        <RegisterContainer>
          <RegisterImg src={Wordmark} alt="" />
          <Formik
            initialValues={{
              name: "",
              username: "",
              email: "",
              password: "",
            }}
            validationSchema={FormSchema}
            onSubmit={(values) => handleRegister(values)}
          >
            <RegisterForm>
              <Input id="username" name="username" placeholder="Username" />
              <Input id="name" name="name" placeholder="Full Name" />
              <Input id="email" name="email" placeholder="E-mail" />
              <Input
                id="password"
                name="password"
                type={"password"}
                placeholder="Password"
              />
              <RegisterButton type="submit">Register</RegisterButton>
              {error.length > 0 ? (
                <p className="text-red-500 mt-4">{error}</p>
              ) : (
                ""
              )}
            </RegisterForm>
          </Formik>
        </RegisterContainer>
        <RegisterContainer className="mt-2 w-full text-white text-center">
          Already have an account?
          <Link to={"login"} className="text-blue-500">
            Login
          </Link>
        </RegisterContainer>
      </div>
    </Wrapper>
  );
}
