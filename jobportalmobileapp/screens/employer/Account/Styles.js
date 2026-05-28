import { StyleSheet } from "react-native";
import Colors from "../../../theme/Color";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.bg.lighter,
  },
  greenBackground: {
    backgroundColor: Colors.primary,
    height: 120,
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  body: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 40,
  },
  headerContainer: { padding: 20, backgroundColor: Colors.white, alignItems: "center", borderBottomWidth: 1, borderBottomColor: Colors.bg.light },
  badgePadding: { paddingHorizontal: 10 },
  logoBox: { alignItems: 'center', marginBottom: 20 },
  logoImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: Colors.primary },
  imageLabel: { fontSize: 14, fontWeight: "bold", color: Colors.text.secondary, marginBottom: 8, marginTop: 5 },
  imageUploadBox: { height: 150, borderWidth: 1, borderColor: Colors.lightGray, borderStyle: "dashed", borderRadius: 8, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bg.lightest, marginBottom: 20 },
  imageUploadBoxDisabled: { backgroundColor: Colors.bg.light },
  previewImage: { width: "100%", height: "100%", resizeMode: "contain" },
  btnHalf: { width: "45%" },
});
