import { StyleSheet } from "react-native";
import Colors from "../../theme/Color";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.status.pending,
    marginTop: 15,
    marginBottom: 10,
  },
  desc: {
    textAlign: "center",
    color: Colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
  },
  updateBtn: {
    marginTop: 20,
  },

  candidateCard: {
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 12,
    backgroundColor: Colors.white,
    elevation: 2,
    overflow: "hidden",
  },
  candidateCardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    paddingRight: 80,
  },
  candidateCardSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  candidateCardBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoryPickerInputNoMargin: {
    marginBottom: 0,
  },
  categoryPickerModalContent: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },

  jobCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
  },
  jobCardSalary: {
    color: Colors.salary.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  jobCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  jobCardLocation: { color: Colors.text.secondary },
  jobCardDate: { color: Colors.text.tertiary },
  jobCardActions: {
    justifyContent: "flex-end",
    paddingTop: 5,
    paddingBottom: 5,
  },
  jobCardBtnEdit: {
    width: 90,
    marginVertical: 0,
    paddingVertical: 0,
    marginRight: 10,
  },
  jobCardBtnDelete: {
    width: 90,
    marginVertical: 0,
    paddingVertical: 0,
    backgroundColor: Colors.status.rejected,
  },
  salaryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  infoText: {
    marginLeft: 6,
    marginBottom: 0,
  },

  statCard: {
    width: "47%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    alignItems: "center",
    borderLeftWidth: 5,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "900",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "600",
  },

  pipelineItem: {
    flex: 1,
    alignItems: "center",
  },
  pipelineValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  pipelineLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: "600",
  },

  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
    fontWeight: "500",
  },
  infoRow: {
    marginBottom: 18,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: Colors.text.tertiary,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: "500",
    marginLeft: 20,
  },
});
