import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

export default StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: Colors.bg.lighter 
    },
    headerBackground: { 
        backgroundColor: Colors.primary, 
        height: 130, 
        width: "100%", 
    },
    body: { 
        marginTop: 20, 
        paddingHorizontal: 16 
    },
    logoutContainer: { 
        padding: 7, 
        borderRadius: 12, 
        margin: 15, 
        alignItems: "center", 
        backgroundColor: Colors.lightGray,
    },
});