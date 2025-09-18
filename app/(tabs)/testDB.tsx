import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { addUser, getAllUsers, verifyLogin } from "../db/queries";

// simple format for testing database operations
export default function TestDB() {
    useEffect(() => {
        // test adding a user
        addUser("Bruce", "Wayne", "TheRealBat", "Batman@gmail.com", "Batman")
            .then(newUser => {
                console.log("User added successfully:", newUser);
            })
            // catch block to handle errors 
            .catch(error => {
                console.error("Error adding user:", error);
            });
        
        // test adding a user
        addUser("Clark", "Kent", "TheRealSuperman", "Superman@gmail.com", "Superman")
            .then(newUser => {
                console.log("User added successfully:", newUser);
            })
            // catch block to handle errors 
            .catch(error => {
                console.error("Error adding user:", error);
            });

        // test fetching all users
        getAllUsers()
            .then(users => {
                console.log("All users:", users);
            })
            // catch block to handle errors
            .catch(error => {
                console.error("Error fetching all users:", error);
            });

        // test login verification (successful)
        verifyLogin("TheRealBat", "Batman")
            .then(user => {
                console.log("Login verification (correct):", user);
            })
            // catch block to handle errors
            .catch(error => {
                console.error("Error with correct login:", error);
            });

        // test login verification (user not found)
        verifyLogin("TheRealBat", "Batman")
            .then(user => {
                console.log("Login verification (correct):", user);
            })
            // catch block to handle errors
            .catch(error => {
                console.error("Error with correct login:", error);
            });

        // test login verification (user not found)
        verifyLogin("TheRealCap", "CaptainAmerica")
            .then(user => {
                console.log("Login verification (user not found):", user);
            })
            // catch block to handle errors
            .catch(error => {
                // this is the expected outcome for a user that doesn't exist yet!
                console.log("Login verification failed as expected (user not found):", error.message);
            });

        // test login verification (wrong password)
        verifyLogin("TheRealBat", "WrongPassword")
            .then(user => {
                console.log("Login verification with wrong password:", user);
            })
            // catch block to handle errors
            .catch(error => {
                // this is the expected outcome for a wrong password!
                console.log("Login verification failed as expected (wrong password):", error.message);
            });
    }, []);

    return (
        <View>
            <Text>Test Database Operations: check console logs for the results for noww </Text>
        </View>
    );
}