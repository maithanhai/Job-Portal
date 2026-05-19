import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

const Styles = StyleSheet.create({
    searchbar: {
        marginBottom: 15,
        backgroundColor: "#f0f0f0"
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 50,
        paddingHorizontal: 20
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555"
    },
    emptySubText: {
        color: "gray",
        fontSize: 13,
        marginTop: 5,
        textAlign: "center"
    }
});

export default Styles;
