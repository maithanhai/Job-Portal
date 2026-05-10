import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, KeyboardAvoidingView, 
  ScrollView, TouchableWithoutFeedback, Keyboard, Alert 
} from "react-native";
import Styles from "./Styles"; 
import { HelperText, SegmentedButtons } from "react-native-paper";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../theme/Color";
import Apis, { endpoints } from "../../configs/Apis";

const Register = () => {
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [user, setUser] = useState({
    "role": "CANDIDATE",
    "full_name": "",
    "email": "",
    "username": "",
    "password": "",
    "confirm": "",
    "company_name": "",
    "address": ""      
  });

  const commonFields = [
    { field: 'full_name', label: 'Họ và tên', icon: 'account-box' },
    { field: 'email', label: 'Email', icon: 'email-outline', keyboardType: 'email-address' },
    { field: 'username', label: 'Tên tài khoản', icon: 'account' },
    { field: 'password', label: 'Mật khẩu', icon: 'lock', isPassword: true },
    { field: 'confirm', label: 'Xác nhận mật khẩu', icon: 'lock-check', isPassword: true },
  ];

  const employerFields = [
    { field: 'company_name', label: 'Tên công ty', icon: 'office-building' },
    { field: 'address', label: 'Địa chỉ', icon: 'map-marker' },
  ];

  const change = (field, value) => {
    setUser(current => ({ ...current, [field]: value }));
  };

  const register = async () => {
    if (user.password !== user.confirm) {
      setErr("Mật khẩu xác nhận không đúng!");
      return;
    }

    setLoading(true);
    try {
      // Lưu ý: Nếu Hải có upload ảnh, chỗ này phải dùng FormData
      // Hiện tại thầy làm kiểu JSON cơ bản trước cho Hải
      let res = await Apis.post(endpoints['register'], user);
      
      if (res.status === 201) {
        Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
        nav.navigate("Login");
      }
    } catch (ex) {
      console.error(ex);
      setErr("Có lỗi xảy ra khi đăng ký, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={Styles.container} showsVerticalScrollIndicator={false}>
          
          <Text style={[Styles.title]}>Đăng ký tài khoản</Text>

          <SegmentedButtons
            value={user.role}
            onValueChange={v => change("role", v)}
            buttons={[
              { value: "CANDIDATE", label: "Ứng viên", icon: "account" },
              { value: "EMPLOYER", label: "Tuyển dụng", icon: "office-building" },
            ]}
            style={{ margin: 20 }}
          />

          <View style={{ paddingHorizontal: 20 }}>
            {err ? <HelperText type="error">{err}</HelperText> : null}

            {commonFields.map(f => {
              if (f.field === 'username' && user.role === 'EMPLOYER') {
                return (
                  <View key="employer-section">
                    {employerFields.map(ef => (
                      <CustomInput
                        key={ef.field}
                        label={ef.label}
                        icon={ef.icon}
                        value={user[ef.field]}
                        onChangeText={t => change(ef.field, t)}
                      />
                    ))}
                    <CustomInput
                      label={f.label}
                      icon={f.icon}
                      value={user[f.field]}
                      onChangeText={t => change(f.field, t)}
                    />
                  </View>
                );
              }

              return (
                <CustomInput
                  key={f.field}
                  label={f.label}
                  icon={f.icon}
                  value={user[f.field]}
                  onChangeText={t => change(f.field, t)}
                  isPassword={f.isPassword}
                  keyboardType={f.keyboardType}
                />
              );
            })}
          </View>

          <CustomButton
            title="HOÀN TẤT ĐĂNG KÝ"
            onPress={register}
            loading={loading}
            style={{ margin: 20 }}
          />

          <View style={Styles.rowCenter}>
            <Text style={{ color: Colors.gray }}>Bạn đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => nav.navigate("Login")}>
              <Text style={Styles.linkText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;