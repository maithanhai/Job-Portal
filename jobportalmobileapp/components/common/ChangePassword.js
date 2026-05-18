import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Button, HelperText } from "react-native-paper";
import API, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "./CustomInput";
import Colors from "../../theme/Color";
import Styles from "../../style/Styles";

const ChangePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    // 1. Validate cơ bản ở client
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      
      // 2. Đóng gói dữ liệu vào FormData
      const formData = new FormData();
      formData.append("old_password", oldPassword); // Trường này để Backend check_password
      formData.append("password", newPassword);     // Trường này để Backend set_password

      // 3. Gọi API PATCH
      const res = await API.patch(endpoints['current-user'], formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi.", [
          { text: "Đồng ý", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (ex) {
      console.error(ex.response?.data);
      
      // 4. Bắt lỗi mật khẩu cũ không chính xác từ Backend trả về
      const errorData = ex.response?.data;
      if (errorData?.old_password) {
        // Trả về câu "Mật khẩu hiện tại không chính xác" từ Serializer
        Alert.alert("Thất bại", errorData.old_password[0]);
      } else {
        Alert.alert("Lỗi", "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 20 }}>
      
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

      <Button
        mode="contained"
        loading={loading}
        onPress={handleChangePassword}
        style={Styles.btn}
        buttonColor={Colors.primary}
      >
        Cập nhật mật khẩu
      </Button>
    </ScrollView>
  );
};


export default ChangePassword;