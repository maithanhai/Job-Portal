import { 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard 
} from "react-native";
import Styles from "../../styles/Style";
import { useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../theme/Color";

const Register = () => {
  const [role, setRole] = useState("CANDIDATE");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const nav = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={"height"}
      style={{ flex: 1, backgroundColor: "white" }} 
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 40, 
              color: 'black'
            }}
          >
            Đăng ký tài khoản
          </Text>

          <SegmentedButtons
            value={role}
            onValueChange={setRole}
            buttons={[
              { value: "CANDIDATE", label: "Ứng viên", icon: "account" },
              { value: "EMPLOYER", label: "Tuyển dụng", icon: "office-building" },
            ]}
            style={{ margin: 20 }}
          />

          <View style={{ paddingHorizontal: 20 }}>
            <CustomInput label="Họ và tên" icon="account-box" />
            <CustomInput 
              label="Email" 
              icon="email-outline" 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />

            {role === "EMPLOYER" && (
              <View>
                <CustomInput label="Tên công ty" icon="office-building" />
                <CustomInput label="Địa chỉ" icon="map-marker" />
              </View>
            )}

            <CustomInput label="Tên tài khoản" icon="account" autoCapitalize="none" />
            <CustomInput 
              label="Mật khẩu" 
              icon="lock" 
              isPassword={true} 
              value={password}
              onChangeText={setPassword}
            />
            <CustomInput 
              label="Nhập lại mật khẩu" 
              icon="lock-check" 
              isPassword={true} 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <CustomButton
            title="HOÀN TẤT ĐĂNG KÝ"
            onPress={() => nav.navigate("Login")}
            style={{ margin: 20 }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <Text style={{ color: Colors.gray, fontSize: 15 }}>
              Bạn đã có tài khoản?{" "}
            </Text>
            <TouchableOpacity onPress={() => nav.navigate("Login")}>
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Đăng nhập ngay
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;