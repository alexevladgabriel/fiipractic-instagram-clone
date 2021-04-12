import { createStore, persist } from "easy-peasy";
import auth from "./auth.js";
import storage from "./storage.js";

const configStore = {
  name: "Instagram",
  disableImmer: false,
  devTools: true,
  initialState: undefined,
  injections: undefined,
  mockActions: false,
};

const initState = {
  auth: persist(auth),
  storage,
};

const store = createStore(initState, configStore);
export default store;
