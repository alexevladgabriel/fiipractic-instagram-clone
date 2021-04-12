import { useState } from "react";

//! components
import { Avatar } from "antd";
import { useStoreState } from "easy-peasy";

import {
  StyledArticle,
  StyledContainer,
  StyledForm,
  StyledPhotoContainer,
  StyledField,
  StyledSubmit,
  StyledLink,
  StyledError,
} from "../Components/EditAccount";

//! formik
import { Formik } from "formik";
import * as Yup from "yup";
import firebase, { auth } from "utils/firebase";

const inputsList = [
  {
    text: "Old Password",
    id: "oldPassword",
    name: "oldPassword",
    placeholder: "Old Password",
    type: "password",
  },
  {
    text: "New Password",
    id: "newPassword",
    name: "newPassword",
    placeholder: "New Password",
    type: "password",
  },
  {
    text: "Confirm New Password",
    id: "confirmNewPassword",
    name: "confirmNewPassword",
    placeholder: "Confirm New Password",
    type: "password",
  },
];

//! poate un regex pt parola ar merge? gen [a-z][A-Z][0-9] + caractere speciale
//! daca gasesc regex-ul ar fi bestial
//! meci mai prost pt Scai, nu stie regex
//! 11:34 AM - 12.04.2021
const FormSchema = Yup.object().shape({
  oldPassword: Yup.string().required("The old password is required =)"),
  newPassword: Yup.string()
    .min(8, "The minimum required for a password is 8")
    .required("The password field is required"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "The passwords must match"
  ),
});

const ChangePassword = () => {
  const details = useStoreState((state) => state.auth.details);
  const [error, setError] = useState({
    type: "error",
    message: undefined,
  });

  const renderError = ({ type, message }) => {
    var style;
    switch (type) {
      case "error":
        style = "text-red-400";
        break;
      case "success":
        style = "text-green-400";
        break;
      default:
        style = "text-red-400";
        break;
    }
    return (
      <StyledError className={`mt-2 ml-48 ${style}`}>{message}</StyledError>
    );
  };

  const handleChange = (
    { oldPassword, password },
    { setSubmitting, resetForm }
  ) => {
    const cred = firebase.auth.EmailAuthProvider.credential(
      details.email,
      oldPassword
    );
    auth.currentUser.reauthenticateWithCredential(cred).catch((err) => {
      console.log(err);
      setError({ type: "error", message: err.message });
    });
    auth.currentUser.updatePassword(password).then(() => {
      setSubmitting(false);
      setError({
        type: "success",
        message: "The password was successfully changed",
      });
    });
    resetForm();
  };
  return (
    <StyledArticle>
      <StyledContainer>
        <div className="flex items-center mt-8">
          <StyledPhotoContainer>
            <Avatar
              className="cursor-pointer"
              size={38}
              src={details?.photoUrl}
              alt={details?.name}
            />
          </StyledPhotoContainer>
          <div>
            <h1 className="text-white text-2xl font-medium">
              {details?.username}
            </h1>
          </div>
        </div>
        <div className="mt-2">
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={FormSchema}
            onSubmit={handleChange}
          >
            {({ errors, dirty, isValid }) => (
              <StyledForm>
                {inputsList.map((data) => {
                  return (
                    <div key={data.id}>
                      <StyledField {...data} />
                      {errors[data.name] ? (
                        <div className="mt-2 ml-48 text-red-400">
                          {errors[data.name]}
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                <StyledSubmit
                  id="recaptcha"
                  type="submit"
                  disabled={!isValid || !dirty}
                >
                  Change Password
                </StyledSubmit>
                <div className="ml-48 mt-6">
                  <StyledLink
                    to={undefined}
                    onClick={() =>
                      auth.sendPasswordResetEmail(details?.email).then(() =>
                        setError({
                          type: "success",
                          message:
                            "A reset password link was sent to your email (be sure you check Spam folder too)",
                        })
                      )
                    }
                  >
                    Forgot password?
                  </StyledLink>
                </div>

                {error.message && renderError(error)}
              </StyledForm>
            )}
          </Formik>
        </div>
      </StyledContainer>
    </StyledArticle>
  );
};

export default ChangePassword;
