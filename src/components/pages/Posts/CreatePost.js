import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router";

//! store
import { useStoreState, useStoreActions, useStore } from "easy-peasy";
import firebase, { db, storage } from "utils/firebase";

//! forms
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

//! styled
import styled from "styled-components";
import tw from "twin.macro";

//! vendors
import { nanoid } from "nanoid";

const StyledContainer = styled.div`
  ${tw`flex justify-center mt-8`}
`;

const StyledNav = styled.nav`
  ${tw`h-12 flex items-center`}
  ${tw`list-none text-white text-center`};
  background-color: rgba(38, 38, 38, 0.2);
`;

const StyledButton = styled.button`
  ${tw`w-1/2`}
`;

const StyledGrid = styled.div`
  width: 900px;
  height: 900px;
  ${tw`grid grid-cols-2 gap-2`}
`;

const colSpan = {
  1: tw`col-span-1`,
  2: tw`col-span-2`,
  3: tw`col-span-3`,
  4: tw`col-span-4`,
  5: tw`col-span-5`,
  6: tw`col-span-6`,
  7: tw`col-span-7`,
  8: tw`col-span-8`,
  9: tw`col-span-9`,
};
const getColSpan = ({ colspan }) => colSpan[colspan] || colSpan[1];
const StyledColumn = styled.div`
  ${tw`rounded`}
  ${getColSpan}
`;

const StyledSubmit = styled.button``;

const Input = styled(Field)`
  border: 1px solid;
  ${tw`p-2 w-full bg-black text-white border-insta-gray`}
`;

const FormSchema = Yup.object().shape({
  caption: Yup.string()
    .strict(true)
    .trim()
    .min(3, "Must be longer than 3 characters")
    .max(512, "Must be smaller than 512 characters")
    .required("Please provide a caption"),
});

const CreatePost = () => {
  const history = useHistory();
  //! store
  const user = useStoreState((state) => state.auth.details);
  const file = useStoreState((state) => state.storage.file);
  const setFile = useStoreActions((action) => action.storage.setFile);

  //! states
  const [step, setStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState();

  //! functions
  const getStep = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <StyledColumn className="bg-black">
              <StyledNav>
                <StyledButton>Filter</StyledButton>
                <StyledButton>Edit</StyledButton>
              </StyledNav>
            </StyledColumn>
            <StyledColumn
              className="bg-black"
              style={{ height: "50px" }}
              colspan="2"
            >
              <StyledSubmit
                className="w-full h-full text-white"
                onClick={() => setStep(1)}
              >
                Next
              </StyledSubmit>
            </StyledColumn>
          </>
        );
      case 1:
        return (
          <>
            <StyledColumn className="bg-black">
              <Formik
                initialValues={{
                  caption: "",
                }}
                validationSchema={FormSchema}
                onSubmit={(values) => handleUpload(values)}
              >
                {({ errors, touched }) => (
                  <Form>
                    <Input
                      id="caption"
                      name="caption"
                      placeholder="Description"
                    />
                    {errors.caption && touched.caption ? (
                      <div className="mt-2 ml-2 text-red-400">
                        {errors.caption}
                      </div>
                    ) : null}
                    <StyledSubmit
                      type="submit"
                      className="mt-4 w-full p-2 text-white"
                    >
                      Upload
                    </StyledSubmit>
                  </Form>
                )}
              </Formik>
            </StyledColumn>

            <StyledColumn
              className="bg-black"
              style={{ height: "50px" }}
              colspan="2"
            >
              <StyledSubmit
                className="w-full h-full text-white"
                onClick={() => setStep(0)}
              >
                Back
              </StyledSubmit>
            </StyledColumn>
          </>
        );
      default:
        return;
    }
  };

  const handleUpload = async ({ caption }) => {
    const imageName = `${file.name}_${nanoid()}`;
    const uploadTask = storage.ref(`posts/${imageName}`).put(file);

    uploadTask.on(
      "stage_changed",
      // progress function
      (snapshot) => {
        //const progress = Math.round(
        //  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //);
        //setProgress(progress);
      },
      // error function
      (error) => console.error(`${imageName} failed to upload.`),
      // complete function
      () => {
        storage
          .ref("posts")
          .child(imageName)
          .getDownloadURL()
          .then(async (imageUrl) => {
            await db.collection("posts").add({
              username: user.username,
              avatarUrl: user.photoUrl,
              caption,
              photoUrl: imageUrl,
              //likes: [],
              //comments: [],
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            setFile(null);
          })
          .catch((err) => console.log(err));
      }
    );
  };

  useEffect(() => {
    if (!file) history.push("/");
    file && setPhotoPreview(URL.createObjectURL(file));

    return () => {
      setFile(null);
    };
  }, [file, setFile, history]);
  return (
    <StyledContainer>
      <StyledGrid>
        <StyledColumn>
          <img className="" src={photoPreview} alt="gicolo" />
        </StyledColumn>
        {getStep(step)}
      </StyledGrid>
    </StyledContainer>
  );
};

export default CreatePost;
