import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.bg.lightest,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        padding: 15,
    },
    emptyBox: {
        alignItems: "center",
        marginTop: 80,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.text.secondary,
    },
    emptySub: {
        color: Colors.text.tertiary,
        fontSize: 13,
        marginTop: 5,
        textAlign: "center",
    }
});