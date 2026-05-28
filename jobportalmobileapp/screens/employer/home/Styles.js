import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

export default StyleSheet.create({
 safeArea: {
        flex: 1,
        backgroundColor: Colors.bg.lighter,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor:Colors.bg.light,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginTop: 2,
    },
    headerAvatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.bg.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 12,
        marginLeft: 4,
    },
    cardContainer: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: Colors.text.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: '70%',
        backgroundColor: Colors.bg.light,
    }
});