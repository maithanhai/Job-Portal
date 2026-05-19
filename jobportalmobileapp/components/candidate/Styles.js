import { StyleSheet } from "react-native";

export const JobCardStyles = StyleSheet.create({
    card: {
        marginBottom: 15,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 10
    },
    salary: {
        color: "#d32f2f",
        fontWeight: "bold",
        marginBottom: 8
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    location: {
        color: "#555",
        flex: 1,
        marginRight: 10
    },
    date: {
        color: "#888",
        fontStyle: 'italic'
    }
});

export const ApplicationCardStyles = StyleSheet.create({
    card: {
        marginBottom: 15,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 10
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8
    }
});
