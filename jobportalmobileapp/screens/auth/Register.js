import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  Platform,
} from "react-native";
import Styles from "./Styles";
import { HelperText, SegmentedButtons, Avatar } from "react-native-paper";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../theme/Color";
import Apis, { endpoints } from "../../configs/Apis";
import * as ImagePicker from "expo-image-picker";

const Register = () => {
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [image, setImage] = useState(null);

  const [user, setUser] = useState({
    role: "CANDIDATE",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: "",
    password: "",
    confirm: "",
    company_name: "",
    address: "",
  });

  const commonFields = [
    { field: "last_name", label: "Họ và tên đệm", icon: "account-box" },
    { field: "first_name", label: "Tên", icon: "account-box" },
    {
      field: "email",
      label: "Email",
      icon: "email-outline",
      keyboardType: "email-address",
    },
    {
      field: "phone_number",
      label: "Số điện thoại",
      icon: "phone",
      keyboardType: "phone-pad",
    },
    {
      field: "username",
      label: "Tên tài khoản",
      icon: "account",
      autoCapitalize: "none",
    },
    { field: "password", label: "Mật khẩu", icon: "lock", isPassword: true },
    {
      field: "confirm",
      label: "Xác nhận mật khẩu",
      icon: "lock-check",
      isPassword: true,
    },
  ];

  const employerFields = [
    { field: "company_name", label: "Tên công ty", icon: "office-building" },
    { field: "address", label: "Địa chỉ", icon: "map-marker" },
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
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const validate = () => {
    if (
      !user.first_name ||
      !user.last_name ||
      !user.email ||
      !user.phone_number ||
      !user.username ||
      !user.password
    ) {
      setErr("Vui lòng nhập đầy đủ thông tin cá nhân!");
      return false;
    }
    if (user.role === "EMPLOYER" && (!user.company_name || !user.address)) {
      setErr("Nhà tuyển dụng cần nhập đầy đủ thông tin công ty!");
      return false;
    }
    if (!image) {
      setErr("Vui lòng chọn ảnh đại diện!");
      return false;
    }
    if (user.password !== user.confirm) {
      setErr("Mật khẩu xác nhận không khớp!");
      return false;
    }
    return true;
  };

  const register = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(user).forEach((key) => {
        if (key !== "confirm" && user[key] !== "") {
          formData.append(key, user[key]);
        }
      });

      if (image) {
        let filename = image.uri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: image.uri,
          name: filename,
          type: type,
        });
      }

      let res = await Apis.post(endpoints["register"], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
        nav.navigate("Login");
      }
    } catch (ex) {
      console.error("Lỗi Server:", ex.response?.data);
      if (ex.response?.data?.username) {
        setErr("Tên tài khoản này đã tồn tại!");
      } else {
        setErr("Đăng ký thất bại, vui lòng kiểm tra lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (fieldConfig) => (
    <CustomInput
      key={fieldConfig.field}
      label={fieldConfig.label}
      icon={fieldConfig.icon}
      value={user[fieldConfig.field]}
      onChangeText={(t) => change(fieldConfig.field, t)}
      isPassword={fieldConfig.isPassword}
      keyboardType={fieldConfig.keyboardType}
      autoCapitalize={fieldConfig.autoCapitalize || "sentences"}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: Colors.white }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={Styles.container}>
            <Text style={Styles.title}>Đăng ký tài khoản</Text>

            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: 90, height: 90, borderRadius: 45 }}
                  />
                ) : (
                  <Avatar.Icon
                    size={90}
                    icon="camera"
                    style={{ backgroundColor: Colors.lightGray }}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={{ fontSize: 12, color: Colors.primary, marginTop: 5 }}
              >
                Chọn ảnh đại diện
              </Text>
            </View>

            <SegmentedButtons
              value={user.role}
              onValueChange={(v) => change("role", v)}
              buttons={[
                { value: "CANDIDATE", label: "Ứng viên", icon: "account" },
                { value: "EMPLOYER", label: "Tuyển dụng", icon: "briefcase" },
              ]}
              style={{ marginHorizontal: 20, marginBottom: 10 }}
            />

            <View style={{ paddingHorizontal: 20 }}>
              {err ? (
                <HelperText type="error" visible={true}>
                  {err}
                </HelperText>
              ) : null}

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
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;
