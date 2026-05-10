import React, { useState } from "react";
import { View } from "react-native";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import Colors from "../../theme/Color";
import { Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigation();

  const handleLogin = () => {
    setIsLoading(true);
    // Chỗ này sau này gọi API thật, giờ cứ giả lập chờ 2 giây
    setTimeout(() => {
      setIsLoading(false);
      console.info("Chuyển đến trang Candidate hoặc Employer")
      nav.navigate("CandidateTabs")
    }, 1000);
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <CustomInput
        label="Username"
        icon="account"
        value={email}
        onChangeText={setEmail}
      />

      <CustomInput
        label="Mật khẩu"
        icon="lock"
        isPassword={true}
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        title="ĐĂNG NHẬP"
        onPress={handleLogin}
        loading={isLoading}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: Colors.gray, fontSize: 15 }}>
          Chưa có tài khoản?{" "}
        </Text>
        <TouchableOpacity
          onPress={() => nav.navigate("Register")}
        >
          <Text
            style={{
              color: Colors.primary, 
              fontSize: 15,
              fontWeight: "bold",
            }}
          >
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
