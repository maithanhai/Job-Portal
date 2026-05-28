import React, { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, Image, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelperText, SegmentedButtons, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import Colors from "../../theme/Color";
import Apis, { endpoints } from "../../configs/Apis";
import GlobalStyles from "../../style/Styles";
import ScreenStyles from "./Styles";

const Register = () => {
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [image, setImage] = useState(null);

  const [user, setUser] = useState({
    role: "CANDIDATE", first_name: "", last_name: "", email: "", phone_number: "",
    username: "", password: "", confirm: "", company_name: "", location: "",
  });

  const commonFields = [
    { field: "first_name", label: "Họ và tên đệm", icon: "account-box" },
    { field: "last_name", label: "Tên", icon: "account-box" },
    { field: "email", label: "Email", icon: "email-outline", keyboardType: "email-address" },
    { field: "phone_number", label: "Số điện thoại", icon: "phone", keyboardType: "phone-pad" },
    { field: "username", label: "Tên tài khoản", icon: "account", autoCapitalize: "none" },
    { field: "password", label: "Mật khẩu", icon: "lock", isPassword: true },
    { field: "confirm", label: "Xác nhận mật khẩu", icon: "lock-check", isPassword: true },
  ];

  const employerFields = [
    { field: "company_name", label: "Tên công ty", icon: "office-building" },
    { field: "location", label: "Địa chỉ", icon: "map-marker" },
  ];

  const change = (field, value) => {
    setUser((current) => ({ ...current, [field]: value }));
    if (err) setErr("");
  };

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập ảnh!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const validate = () => {
    if (!user.first_name || !user.last_name || !user.email || !user.phone_number || !user.username || !user.password) {
      setErr("Vui lòng nhập đầy đủ thông tin cá nhân!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        setErr("Địa chỉ email không đúng định dạng!");
        return false;
    }

    const phoneRegex = /^0[0-9]{9,10}$/;
    if (!phoneRegex.test(user.phone_number)) {
        setErr("Số điện thoại không hợp lệ (Bắt đầu bằng số 0, dài 10-11 chữ số)!");
        return false;
    }

    if (user.role === "EMPLOYER" && (!user.company_name || !user.location)) {
      setErr("Nhà tuyển dụng cần nhập đầy đủ thông tin công ty!");
      return false;
    }

    if (!image) { setErr("Vui lòng chọn ảnh đại diện!"); return false; }
    if (user.password !== user.confirm) { setErr("Mật khẩu xác nhận không khớp!"); return false; }
    
    return true;
  };

  const register = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => {
        if (key !== "confirm" && user[key] !== "") formData.append(key, user[key]);
      });

      if (image) {
        let filename = image.uri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        formData.append("avatar", { uri: image.uri, name: filename, type: type });
      }

      let res = await Apis.post(endpoints["register"], formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.status === 201) {
        Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
        nav.navigate("Login");
      }
    } catch (ex) {
      console.log("Lỗi Backend trả về:", ex.response?.data);
      if (ex.response?.data?.username) setErr("Tên tài khoản này đã tồn tại!");
      else setErr("Đăng ký thất bại, vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (f) => (
    <CustomInput key={f.field} label={f.label} icon={f.icon} value={user[f.field]}
      onChangeText={(t) => change(f.field, t)} isPassword={f.isPassword}
      keyboardType={f.keyboardType} autoCapitalize={f.autoCapitalize || "sentences"}
    />
  );

  return (
    <SafeAreaView style={ScreenStyles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={ScreenStyles.registerScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={GlobalStyles.container}>
              <Text style={GlobalStyles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

              <View style={ScreenStyles.avatarContainer}>
                <TouchableOpacity onPress={pickImage}>
                  {image ? (
                    <Image source={{ uri: image.uri }} style={ScreenStyles.imagePreview} />
                  ) : (
                    <Avatar.Icon size={90} icon="camera" style={ScreenStyles.avatarIcon} color={Colors.gray} />
                  )}
                </TouchableOpacity>
                <Text style={ScreenStyles.avatarText}>Chọn ảnh đại diện</Text>
              </View>

              <SegmentedButtons
                value={user.role}
                onValueChange={(v) => change("role", v)}
                buttons={[
                  { value: "CANDIDATE", label: "Ứng viên", icon: "account", checkedColor: Colors.white, style: user.role === 'CANDIDATE' ? ScreenStyles.activeSegmentButton : {} },
                  { value: "EMPLOYER", label: "Tuyển dụng", icon: "briefcase", checkedColor: Colors.white, style: user.role === 'EMPLOYER' ? ScreenStyles.activeSegmentButton : {} },
                ]}
                style={ScreenStyles.segmentedButtons}
              />

              {err ? <HelperText type="error" visible={true}>{err}</HelperText> : null}

              <View style={ScreenStyles.inputContainer}>
                {commonFields.map((f) => {
                  if (f.field === "username" && user.role === "EMPLOYER") {
                    return (
                      <View key="employer-section">
                        {employerFields.map((ef) => renderInput(ef))}
                        {renderInput(f)}
                      </View>
                    );
                  }
                  return renderInput(f);
                })}
              </View>

              <CustomButton title="HOÀN TẤT ĐĂNG KÝ" onPress={register} loading={loading} style={ScreenStyles.registerBtnSpacer} />

              <View style={GlobalStyles.rowCenter}>
                <Text style={{ color: Colors.text.secondary }}>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => nav.navigate("Login")}>
                  <Text style={GlobalStyles.linkText}>Đăng nhập ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;