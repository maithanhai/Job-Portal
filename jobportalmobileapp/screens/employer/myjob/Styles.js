import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.lighter,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.text.secondary,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 50,
  },

  formContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.light,
  },
  headerTitle: {
    fontWeight: "bold",
    color: Colors.primary,
    fontSize: 18,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfInput: {
    width: "47%",
  },
  editorContainer: {
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.bg.light,
  },
  editorLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.text.secondary,
    backgroundColor: Colors.bg.lightest,
    padding: 8,
  },
  toolbar: {
    backgroundColor: Colors.bg.lightest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.light,
  },
  richEditor: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: -8,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  modalContent: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  helperText: {
    fontSize: 14,
    paddingLeft: 0,
    marginBottom: 5,
    color: Colors.text.error,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.light,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent", 
  },
  tabActive: {
    borderBottomColor: Colors.primary, 
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
});
