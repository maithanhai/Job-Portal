import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Icon, Text } from "react-native-paper";
import moment from "moment";
import "moment/locale/vi";
import Colors from "../../theme/Color";
import CustomButton from "../common/CustomButton";
import ComponentStyles from "./Styles";

const JobCard = ({ item, onDelete, onEdit }) => {
  const formatSalary = (salary) => {
    if (!salary) return "";

    if (salary >= 1000000) {
      return `${parseFloat((salary / 1000000).toFixed(1))}tr`;
    } else if (salary >= 100000) {
      return `${parseFloat((salary / 1000).toFixed(1))}k`;
    } else {
      return salary.toLocaleString("vi-VN");
    }
  };

  const getSalaryText = () => {
    if (item.is_negotiable) {
      return "Thỏa thuận";
    }
    if (item.salary_min && item.salary_max) {
      return `Lương ${formatSalary(item.salary_min)} - ${formatSalary(item.salary_max)}`;
    } else if (item.salary_min) {
      return `Lương ${formatSalary(item.salary_min)}`;
    }
    return "Chưa cập nhật";
  };

  return (
    <Card
      style={[ComponentStyles.jobCard, item.is_expired && { opacity: 0.7 }]}
      elevation={2}
    >
      <Card.Title
        title={item.name}
        titleStyle={{
          fontWeight: "bold",
          color: item.is_expired ? Colors.text.disabled : Colors.primary,
          fontSize: 16,
        }}
        subtitle={item.company_name || "Công ty của bạn"}
        right={(props) =>
          item.is_expired ? (
            <Text
              style={{
                color: Colors.status.rejected,
                fontWeight: "bold",
                marginRight: 15,
                fontSize: 12,
              }}
            >
              ĐÃ ĐÓNG
            </Text>
          ) : null
        }
      />

      <Card.Content>
        <View style={ComponentStyles.salaryWrapper}>
          <Icon
            source="cash-multiple"
            size={20}
            color={item.is_expired ? Colors.text.disabled : Colors.status.accepted} 
          />
          <Text
            variant="bodyMedium"
            style={[
              ComponentStyles.jobCardSalary,
              ComponentStyles.infoText,
              item.is_expired && { color: Colors.text.disabled },
            ]}
          >
            {getSalaryText()}
          </Text>
        </View>

        <View style={ComponentStyles.jobCardRow}>
          <View style={ComponentStyles.infoItem}>
            <Icon
              source="map-marker-outline"
              size={18}
              color={item.is_expired ? Colors.text.disabled : Colors.text.primary}
            />
            <Text variant="bodySmall" style={[ComponentStyles.jobCardLocation, ComponentStyles.infoText]}>
              {item.location || "Chưa cập nhật"}
            </Text>
          </View>

          <View style={ComponentStyles.infoItem}>
            <Icon
              source="clock-outline"
              size={18}
              color={item.is_expired ? Colors.text.disabled : Colors.text.primary}
            />
            <Text variant="bodySmall" style={[ComponentStyles.jobCardDate, ComponentStyles.infoText]}>
              {moment(item.updated_at).fromNow()}
            </Text>
          </View>
        </View>
      </Card.Content>

      <Card.Actions style={ComponentStyles.jobCardActions}>
        {!item.is_expired && (
          <CustomButton
            title="Sửa"
            mode="outlined"
            onPress={onEdit}
            style={ComponentStyles.jobCardBtnEdit}
          />
        )}
        <CustomButton title="Xóa" onPress={onDelete} style={ComponentStyles.jobCardBtnDelete} />
      </Card.Actions>
    </Card>
  );
};

export default JobCard;