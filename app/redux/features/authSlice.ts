import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthUser } from "../../types/auth";

const initialState: AuthState = {
  user: null,
  token: null,
  accessToken: null,
  refreshToken: null,
  authorization: null,
};

type SetCredentialsPayload = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  authorization: string;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<SetCredentialsPayload>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.authorization = action.payload.authorization;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.authorization = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
