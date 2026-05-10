import { StyleSheet } from "react-native";
import Color from "../../theme/Color";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 50
    },
    padding: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
        marginTop: 50
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Color.primary,
        textAlign: 'center',
        marginBottom: 30
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    linkText: {
        color: Color.primary,
        fontWeight: 'bold'
    },
    margin:{
        margin: 5,
    }
});