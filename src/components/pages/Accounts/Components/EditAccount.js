import { useState } from "react";

//! states
import { useStoreState, useStoreActions } from "easy-peasy";

//! components
import { Link } from "react-router-dom";
import { Avatar } from "antd";
import AvatarUploadModal from "components/elements/Avatar";

//! firebase
import firebase, { auth, db } from "utils/firebase";

//! formik
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

//! styled
import styled from "styled-components";
import tw from "twin.macro";

export const StyledArticle = styled.article`
  ${tw`flex w-full`}
  flex: 1 1 400px;
  min-width: 50px;
`;
export const StyledContainer = styled.div`
  ${tw`w-full`}
`;
export const StyledForm = styled(Form)``;
const StyledInput = styled(Field)`
  border: 1px solid #363636;
  padding: 0 10px;
  border-radius: 3px;
  min-width: 355px;
  ${tw`w-full h-8`}

  :disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StyledAside = styled.aside`
  flex: 0 0 161px;
  font-size: 16px;
  font-weight: 600;
  line-height: 18px;
  margin-top: 6px;
  //!
  text-align: end;
`;

export const StyledPhotoContainer = styled.div`
  margin: 2px 32px 0 124px;
  width: 38px;
  height: 38px;
`;

const StyledButton = styled.button`
  color: rgba(0, 149, 246, 1);
  ${tw`font-semibold`}
`;

export const StyledSubmit = styled.button`
  ${tw`ml-48 mt-6 text-white p-1 pr-3 pl-3 rounded-md`}
  background-color:#0095f6;
  :disabled {
    ${tw`cursor-auto`}
    background-color: rgba(0, 149, 246, 0.3);
  }
`;

export const StyledLink = styled(Link)`
  color: #0095f6;
`;

export const StyledError = styled.div`
  max-width: 400px;
`;

const inputsList = [
  {
    text: "Name",
    id: "name",
    name: "name",
    placeholder: "Name",
  },
  {
    text: "Username",
    id: "username",
    name: "username",
    placeholder: "Username",
    disabled: true,
  },
  {
    text: "Website",
    id: "website",
    name: "website",
    placeholder: "Website",
  },
  {
    component: "textarea",
    text: "Bio",
    id: "bio",
    name: "bio",
    placeholder: "",
  },
  {
    text: "Email",
    id: "email",
    name: "email",
    placeholder: "Email",
    disabled: true,
  },
  {
    text: "Phone Number",
    id: "phoneNumber",
    name: "phoneNumber",
    placeholder: "Phone Number",
  },
];

//! --- COMPONENTS
export const StyledField = ({
  id,
  component,
  text,
  name,
  placeholder,
  type,
  disabled,
}) => (
  <div className="flex mt-4">
    <StyledAside className="flex justify-end mr-8">
      <label htmlFor={id}>{text}</label>
    </StyledAside>
    <div>
      <StyledInput
        className="bg-black focus:border-white focus:rounded-none"
        component={component}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
      />
      {/* 
          Momentul ala cand, te gandesti daca userul 
          isi pune acelasi username cu al altei persoane, si atunci se duce totul de "râpă"
          ma credeam in Laravel (PHP)(Backend), sa am unicitatea field-urilor.
          Mi-am luat teapa.
      */}
      {name === "username" ? (
        <div className="mt-2 text-red-400">
          This field was disabled for security reasons
        </div>
      ) : (
        ""
      )}
    </div>
  </div>
);

//! stack overflow moment
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
//! --- SCHEMA
const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum of 3 characters required")
    .required("The name field is required"),
  username: Yup.string()
    .min(3, "Minimum of 3 characters required")
    .required("The username field is required"),
  website: Yup.string().url("Must be a valid website"),
  bio: Yup.string().max(169, "Must be lower than 169 characters"),
  email: Yup.string()
    .email("Must be a valid email")
    .required("The email field is required"),
  phoneNumber: Yup.string().matches(
    /^\+(?:[0-9] ?){6,14}[0-9]$/,
    "Must be a valid phone number"
  ),
});

//! --- MAIN COMPONENT
const EditAccount = () => {
  const details = useStoreState((state) => state.auth.details);
  const setDetails = useStoreActions((action) => action.auth.setDetails);
  const setUsername = useStoreActions((action) => action.auth.setUsername);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleChange = async (
    { name, username, website, bio, email, phoneNumber },
    { setSubmitting, resetForm }
  ) => {
    if (
      details.name !== name ||
      details.username !== username ||
      details.siteUrl !== website ||
      details.description !== bio
    ) {
      auth.currentUser.updateProfile({
        displayName: name,
      });
      const query = db
        .collection("users")
        .where("email", "==", details.email)
        .get();
      query.then((snapshot) => {
        const data = {
          name: name,
          username: username,
          siteUrl: website,
          description: bio,
        };
        snapshot.forEach(async (doc) => {
          //! momentul ala cand updatezi informatia in firebase,
          //! dar sub niciun fel, daca faci retrieve tot datele vechi raman.
          //! singura metoda cred e sa deloghez user-ul, iar user-ul sa fie nevoit sa se relogheze
          await doc.ref.update(data);
        });
      });

      //! moment de -200iq
      await db
        .collection("posts")
        .where("username", "==", details.username)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            if (doc.exists) {
              doc.ref.update({ username });
              setUsername(username);
            }
          });
        });

      await db
        .collection("posts")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref
              .collection("likes")
              .where("username", "==", details.username)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => doc.ref.update({ username }));
              });
            doc.ref
              .collection("comments")
              .where("username", "==", details.username)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => doc.ref.update({ username }));
              });
          });
        });
    }

    if (details?.phoneNumber !== phoneNumber) {
      var applicationVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha",
        {
          size: "invisible",
          callback: () => {},
        }
      );
      var provider = new firebase.auth.PhoneAuthProvider();
      provider
        .verifyPhoneNumber(phoneNumber, applicationVerifier)
        .then(function (verificationId) {
          var verificationCode = window.prompt(
            "Please enter the verification " +
              "code that was sent to your mobile device."
          );
          return firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            verificationCode
          );
        })
        .catch((err) => console.log(err))
        .then(async (phoneCredential) => {
          const query = db
            .collection("users")
            .where("email", "==", details.email)
            .get();

          await query.then((snapshot) => {
            snapshot.forEach((doc) => {
              doc.ref.update({
                phoneNumber,
              });
            });
          });
          return auth.currentUser.updatePhoneNumber(phoneCredential);
        });
    }
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
              onClick={() => setModalOpen(true)}
            />
          </StyledPhotoContainer>
          <AvatarUploadModal isOpened={isModalOpen} setIsOpen={setModalOpen} />
          <div>
            <h1 className="text-white text-lg font-medium">
              {details?.username}
            </h1>
            <StyledButton onClick={() => setModalOpen(true)}>
              Change Profile Photo
            </StyledButton>
          </div>
        </div>
        <div className="mt-2">
          {details && (
            <Formik
              initialValues={{
                name: details.name,
                username: details.username,
                website: details.siteUrl,
                bio: details.description,
                email: details.email,
                phoneNumber: details.phoneNumber,
              }}
              validationSchema={FormSchema}
              onSubmit={handleChange}
            >
              {/* moment de 200iq pe Scai scapam de 40-50 de linii de cod */}
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
                  {/* <StyledField
                    text="Name"
                    id="name"
                    name="name"
                    placeholder="Name"
                  >
                    Name
                  </StyledField>
                  <StyledField
                    text="Username"
                    id="username"
                    name="username"
                    placeholder="Username"
                  >
                    Username
                  </StyledField>
                  <StyledField
                    text="Website"
                    id="website"
                    name="website"
                    placeholder="Website"
                  >
                    Website
                  </StyledField>
                  <StyledField
                    text="Bio"
                    component="textarea"
                    id="bio"
                    name="bio"
                    placeholder=""
                  >
                    Bio
                  </StyledField>
                  <StyledField
                    text="Email"
                    id="email"
                    name="email"
                    placeholder="Email"
                  >
                    Email
                  </StyledField>
                  <StyledField
                    text="Phone Number"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                  >
                    Phone Number
                  </StyledField> */}

                  <StyledSubmit
                    id="recaptcha"
                    type="submit"
                    disabled={!isValid || !dirty}
                  >
                    Submit
                  </StyledSubmit>
                </StyledForm>
              )}
            </Formik>
          )}
        </div>
      </StyledContainer>
    </StyledArticle>
  );
};

export default EditAccount;
