import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Card, Text, IconButton, Avatar } from "react-native-paper";
import moment from "moment";
import "moment/locale/vi";
import Colors from "../../theme/Color";
import Styles from "../../style/Styles";
import { useNavigation } from "@react-navigation/native";

const JobCard = ({ item, next }) => {
  const nav = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => nav.navigate("JobDetail", { jobId: item.id })}
    >
      <Card style={Styles.card}>
        <Card.Title
          title={item.name}
          titleStyle={{
            fontWeight: "bold",
            color: Colors.primary,
            fontSize: 16,
          }}
          subtitle={item.company_name || "Công ty ẩn danh"}
          left={(props) => (
            <Avatar.Image
              {...props}
              size={45}
              source={{
                uri:
                  item.avatar ||
                  "https://digitalhealthskills.com/no-user-image-icon-27/",
              }}
            />
          )}
          right={(props) => (
            <IconButton
              {...props}
              icon="heart-outline"
              iconColor={Colors.primary}
              onPress={() => {}}
            />
          )}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={localStyles.salary}>
            Lương: {item.salary_min ? `${item.salary_min} VNĐ` : "Thỏa thuận"}
          </Text>
          <View style={localStyles.row}>
            <Text variant="bodySmall" style={localStyles.location}>
              {item.location || "Chưa cập nhật"}
            </Text>
            <Text variant="bodySmall" style={localStyles.date}>
              {moment(item.updated_at).fromNow()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  card: { marginBottom: 15, backgroundColor: "white", elevation: 2 },
  salary: { color: "#d32f2f", fontWeight: "bold", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  location: { color: "#555" },
  date: { color: "#888", fontStyle: "italic" },
});

export default JobCard;
