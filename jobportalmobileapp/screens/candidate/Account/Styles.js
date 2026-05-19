import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

const Styles = StyleSheet.create({
    //Man hinh account
    greenBackground: {
        backgroundColor: "#00bfa5",
        height: 130,
        width: "100%",
    },
    infoCard: {
        backgroundColor: "white",
        marginHorizontal: 16,
        marginTop: -60,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarWrapper: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    userRole: {
        fontSize: 13,
        color: "#666",
    },
    body: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    menuGroup: {
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
    },
    logoutBox: {
        padding: 7,
        borderRadius: 12,
        margin: 15,
        alignItems: "center",
        backgroundColor: Colors.lightGray || "#e0e0e0",
    },
});

export default Styles;
