import { action } from "easy-peasy";

const state = {
  isLoading: true,
  isLogged: false,
  user: {},
  details: {},
  setUser: action((state, payload) => {
    //state.isLogged = true;
    state.user = payload;
  }),
  setDetails: action((state, payload) => {
    state.details = payload;
  }),
  setLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  setUsername: action((state, payload) => {
    state.details.username = payload;
  }),
  setPhotoUrl: action((state, payload) => {
    state.details.photoUrl = payload;
  }),
};
export default state;
