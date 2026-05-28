import React, { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { HelperText } from "react-native-paper";
import API, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton"; 
import Colors from "../../theme/Color";
import GlobalStyles from "../../style/Styles";

const ChangePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    
    if (oldPassword === newPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới phải khác mật khẩu hiện tại.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await API.post(endpoints['change-password'], {
        "old_password": oldPassword,
        "new_password": newPassword,    
        "confirm_password": confirmPassword
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
      });

      if (response.status === 200) {
        Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi.", [
          { text: "Đồng ý", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (ex) {
      const errorData = ex.response?.data;
      if (errorData) {
        const errorMessage = Object.values(errorData)[0];
        Alert.alert("Thất bại", Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
      } else {
        Alert.alert("Lỗi", "Đã có lỗi xảy ra.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.white }} contentContainerStyle={{ padding: 20 }}>
      
      <CustomInput
        label="Mật khẩu hiện tại"
        value={oldPassword}
        onChangeText={setOldPassword}
        isPassword={true} 
        icon="lock-outline"
      />

      <CustomInput
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        isPassword={true}
        icon="lock-reset"
      />

      <CustomInput
        label="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        isPassword={true}
        icon="check-circle-outline"
      />

      <CustomButton
        title="Cập nhật mật khẩu"
        loading={loading}
        onPress={handleChangePassword}
        style={GlobalStyles.btn}
      />
    </ScrollView>
  );
};

export default ChangePassword;