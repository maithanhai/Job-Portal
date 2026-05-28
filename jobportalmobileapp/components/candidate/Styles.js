import { StyleSheet } from 'react-native';
import Colors from '../../theme/Color';

export default StyleSheet.create({
    card: {
        marginBottom: 15,
        backgroundColor: Colors.white,
        elevation: 2,
        borderRadius: 10,
    },
    jobTitle: {
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    companyName: {
        color: Colors.text.secondary,
        fontSize: 14,
        marginBottom: 10,
    },
    salary: {
        color: Colors.salary.primary,
        fontWeight: "bold",
        marginBottom: 8,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    label: {
        fontWeight: 'bold',
        color: Colors.text.primary,
        flex: 1,
    },
    value: {
        color: Colors.text.secondary,
    },
    statusValue: {
        fontWeight: 'bold',
    },
    noteValue: {
        color: Colors.text.secondary,
        flex: 1,
        textAlign: "right",
    },

    jobCardContainer: {
        marginBottom: 15,
        backgroundColor: Colors.white,
        borderRadius: 12,
        elevation: 2,
    },
    jobCardTitle: {
        fontWeight: 'bold',
        color: Colors.primary,
        fontSize: 16,
    },
    jobCardSalary: {
        fontWeight: "bold",
        color: Colors.salary.primary,
        fontSize: 14,
        marginLeft: 4,
    },
    jobCardLocation: {
        color: Colors.text.secondary,
        fontSize: 13,
        marginLeft: 4,
        flex: 1,
    },
    jobCardDivider: {
        marginHorizontal: 15,
        marginVertical: 8,
        backgroundColor: Colors.bg.light,
    },
    jobCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    jobCardTime: {
        color: Colors.text.tertiary,
        fontStyle: 'italic',
        fontSize: 12,
        marginLeft: 4,
    },
    jobCardCompareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    jobCardCompareText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.text.secondary,
        marginLeft: 4,
    },

    applyModalContainer: {
        backgroundColor: Colors.white,
        padding: 20,
        margin: 20,
        borderRadius: 12,
    },
    applyModalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: Colors.text.primary,
    },
    applyModalLabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        color: Colors.text.secondary,
    },
    applyModalFileSelected: {
        color: Colors.status.accepted,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    applyModalInput: {
        marginBottom: 15,
        backgroundColor: Colors.white,
    },
    applyModalButtonRow: {
        justifyContent: "space-between",
        marginTop: 5,
    },
    applyModalButtonHalf: {
        width: "45%",
        borderColor: Colors.gray,
    },
});
