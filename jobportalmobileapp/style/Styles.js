import { StyleSheet } from "react-native";
import Colors from "../theme/Color";

const Styles = StyleSheet.create({
  //Layout chung
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f4f5f7",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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

  //Chu va tieu de
  subject: {
    fontSize: 30,
    fontWeight: "bold",
    color: "blue",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },

  // Form va nut bam
  header: {
    alignItems: "center",
    padding: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  btn: {
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  //Man hinh account
  greenBackground: {
    backgroundColor: "#00bfa5",
    height: 130,
    width: "100%",
  },
  infoCard: {
    backgroundColor: "white",
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
    color: "#333",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: "#666",
  },
  body: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuGroup: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  logoutBox: {
    padding: 7,
    borderRadius: 12,
    margin: 15,
    alignItems: "center",
    backgroundColor: Colors.lightGray || "#e0e0e0",
  },
});

export default Styles;
