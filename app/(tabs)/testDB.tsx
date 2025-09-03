import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { addUser, getAllUsers, verifyLogin } from "../db/queries";

export default function TestDB() {
    useEffect(() => {
        // Test adding a user
        addUser("Steven", "Rogers", "TheRealCap", "CaptainAmerica@gmail.com", "CaptainAmerica");

        // Test fetching all users
        getAllUsers().then(users => {
            console.log("All users:", users);
        });

        // Test login verification
        verifyLogin("TheRealCap", "CaptainAmerica").then(user => {
            console.log("Login verification:", user);
        });
        verifyLogin("TheRealCap", "WrongPassword").then(user => {
            console.log("Login verification with wrong password:", user);
        });
    }, []);

    return (
        <View>
            <Text>Test Database Operations: check console logs for the results for noww </Text>
        </View>
    );
}