//inspired by loginpage.tests.ts 
import { fireEvent, render } from "@testing-library/react-native";
import { push } from "expo-router/build/global-state/routing";
import * as React from "react";
import signup from "../app/(public)/signup";
 //mock the useRouter 
 const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({ push : mockPush }),
}));
//mock the addUser function
const mockAddUser = jest.fn();
jest.mock("../app/db/queries", () => ({
    addUser: (...args: any[]) => mockAddUser(...args),
}));
const alertMock = jest.fn();
global.alert = alertMock;

describe("SignUp page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows alert if fields are empty", async () => {
        const { getByText } = render(React.createElement(signup, null));
        const btn = getByText("Sign Up");
        fireEvent.press(btn);
        expect(alertMock).toHaveBeenCalledWith("Please enter username, email, and password.");
    }
    );
    it("calls addUser and navigates succesful sign-up", async () => {
        mockAddUser.mockResolvedValueOnce(undefined);
        const { getByText, getByPlaceholderText } = render(React.createElement(signup, null));
        fireEvent.changeText(getByPlaceholderText("Username"), "testuser");
        fireEvent.changeText(getByPlaceholderText("Password"), "password123");
        fireEvent.changeText(getByPlaceholderText("Email"), "testing@gmail.com");
        fireEvent.changeText(getByPlaceholderText("First Name"), "Test");
        fireEvent.changeText(getByPlaceholderText("Last Name"), "User");
        const btn = getByText("Sign Up");
        fireEvent.press(btn);

        expect(mockAddUser).toHaveBeenCalledWith("Test", "User", "testuser", "testing@gmail.com", "password123");
        expect(alertMock).toHaveBeenCalledWith("Sign-up successful! You can now log in.");
        expect(push).toHaveBeenCalledWith("/(public)/login");
    }

    );
});