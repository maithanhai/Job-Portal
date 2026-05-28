import { StyleSheet } from "react-native";
import Colors from "../../theme/Color";

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    loginScroll: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    registerScroll: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    avatarContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
    imagePreview: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    avatarIcon: {
        backgroundColor: Colors.bg.light,
    },
    avatarText: {
        fontSize: 12,
        color: Colors.primary,
        marginTop: 5,
        fontWeight: 'bold',
    },
    segmentedButtons: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    activeSegmentButton: {
        backgroundColor: Colors.primary,
    },
    inputContainer: {
        paddingHorizontal: 20,
    },
    registerBtnSpacer: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    signupPromptText: {
        color: Colors.text.secondary,
    },
});