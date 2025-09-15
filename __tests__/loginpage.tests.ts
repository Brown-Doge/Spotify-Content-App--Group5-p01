import * as React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Login from "../app/(public)/login";

jest.mock("expo-web-browser", () => ({ maybeCompleteAuthSession: jest.fn() }));

const mockUseAuthRequest = jest.fn();
jest.mock("expo-auth-session", () => {
  const actual = jest.requireActual("expo-auth-session");
  return {
    ...actual,
    useAuthRequest: (...args: any[]) => mockUseAuthRequest(...args),
    makeRedirectUri: actual.makeRedirectUri,
  };
});

describe("Login page - GitHub button", () => {
  it("is disabled when request is not ready", () => {
    mockUseAuthRequest.mockReturnValue([null, null, jest.fn()]);

    const { getByText } = render(React.createElement(Login, null)); // no JSX
    expect(getByText("github")).toBeDisabled();
  });

  it("clicks GitHub button and triggers promptAsync", () => {
    const promptAsync = jest.fn();
    mockUseAuthRequest.mockReturnValue([{}, null, promptAsync]);

    const { getByText } = render(React.createElement(Login, null)); // no JSX
    const btn = getByText("github");

    expect(btn).not.toBeDisabled();
    fireEvent.press(btn);
    expect(promptAsync).toHaveBeenCalledTimes(1);
  });
});
