import { StyleSheet } from "react-native";
import Colors from "../../theme/Color";

export default StyleSheet.create({
  customButton: {
    borderRadius: 8,
    paddingVertical: 4,
    marginVertical: 10,
  },
  customButtonLabel: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 0, 
  },

  customInput: {
    marginBottom: 15,
    backgroundColor: Colors.white,
  },

  compareBarContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: Colors.bg.light,
  },
  compareBarText: {
    color: Colors.text.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  compareBarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  compareBarBadge: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  compareBarBadgeText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  compareBarBtnCancel: {
    minWidth: 70, 
    marginHorizontal: 0,
  },
  compareBarSpacing: {
    width: 10,
  },
  compareBarBtnCompare: {
    minWidth: 100, 
    marginHorizontal: 0,
  },

  filterModalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: "90%",
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  filterModalSectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginTop: 10,
    marginBottom: 5,
  },
  filterModalRadioGroupScroll: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.bg.light,
    borderRadius: 8,
    marginBottom: 15,
  },
  filterModalRadioLabel: {
    fontSize: 14,
  },
  filterModalRowBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  filterModalBtn: {
    width: "48%",
  },

  headerContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  headerChipWrapper: {
    marginHorizontal: 5,
  },

  jobDetailContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  jobDetailCard: {
    backgroundColor: Colors.white,
    borderRadius: 0,
  },
  jobDetailCardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.primary,
  },
  jobDetailSalary: {
    color: Colors.salary.primary,
    fontWeight: "bold",
    marginBottom: 12,
  },
  jobDetailInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  jobDetailInfoLabel: {
    fontWeight: "bold",
    marginLeft: 6,
  },
  jobDetailInfoValue: {
    flex: 1,
    flexWrap: "wrap",
  },
  jobDetailDeadlineError: {
    color: Colors.text.error,
    fontWeight: "bold",
  },
  jobDetailDescriptionSection: {
    backgroundColor: "white",
    marginTop: 10,
  },
  jobDetailDescriptionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.text.primary,
  },

  logoutButtonTitle: {
    color: "red",
    fontWeight: "bold",
  },

  settingItemDivider: {
    marginBottom: 0,
  },

  profileHeaderContainer: {
    marginBottom: 0,
  },
  profileHeaderAvatarWrapper: {
    marginRight: 12,
  },
  profileHeaderAvatarBg: {
    backgroundColor: Colors.bg.light,
  },
  profileHeaderTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileHeaderUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
  },
  profileHeaderUserRole: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },

  userDetailContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  userDetailKeyboardDismiss: {
    keyboardShouldPersistTaps: "handled",
  },
});
