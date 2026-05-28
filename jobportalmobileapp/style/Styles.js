import { StyleSheet } from "react-native";
import Colors from "../theme/Color";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.bg.lighter,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  margin: {
    margin: 5,
  },
  spacer: {
    flex: 1,
  },
  padding: {
    padding: 20,
  },

  subject: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },

  header: {
    alignItems: "center",
    padding: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: Colors.white,
  },
  btn: {
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: -60,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarWrapper: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: Colors.text.secondary,
  },

  menuGroup: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    elevation: 2,
  },
});

export default Styles;
