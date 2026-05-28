import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.lightest,
  },
  listContent: {
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  footerLoader: {
    paddingVertical: 20,
  },
  safeAreaDetail: { flex: 1, backgroundColor: Colors.bg.lightest },
  profileHeader: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bg.light,
  },
  headerRight: { marginLeft: 15, justifyContent: "center" },
  candidateName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text.primary,
  },
  jobName: { fontSize: 13, color: Colors.text.secondary, marginBottom: 2 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  messageCard: { marginBottom: 15, backgroundColor: Colors.bg.lighter },
  message: { fontStyle: "italic", fontSize: 13, color: Colors.text.secondary },
  cvBox: {
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.bg.light,
    marginBottom: 20,
  },
  actionBar: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.bg.light,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
