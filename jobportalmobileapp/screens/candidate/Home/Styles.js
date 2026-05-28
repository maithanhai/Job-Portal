import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.bg.lighter,
    },
    headerBox: {
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: Colors.white,
        paddingBottom: 10,
    },
    searchbar: {
        marginTop: 5,
        backgroundColor: Colors.bg.lightest,
        elevation: 0,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 10,
    },
    listPadding: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    emptyBox: {
        alignItems: "center",
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.text.primary,
    },
    emptySubText: {
        color: Colors.text.secondary,
        fontSize: 13,
        marginTop: 5,
        textAlign: "center",
    },

    scrollCompare: {
        padding: 15,
    },
    cardCompare: {
        backgroundColor: Colors.white,
        marginRight: 15,
        borderRadius: 16,
        padding: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    jobTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.primary,
    },
    company: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: Colors.primary,
        marginBottom: 10,
        textTransform: "uppercase",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});