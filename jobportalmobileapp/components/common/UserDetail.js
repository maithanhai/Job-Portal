import React, { useContext, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { MyUserContext } from "../../configs/Contexts";
import Apis, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import Styles from "../../style/Styles";
import Colors from "../../theme/Color";

const UserDetail = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const [updatedUser, setUpdatedUser] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    email: user?.email || "",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarFile(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedUser.email)) {
      Alert.alert("Lỗi", "Địa chỉ email không đúng định dạng.");
      return;
    }

    const phoneRegex = /^0[0-9]{9,10}$/;
    if (!phoneRegex.test(updatedUser.phone_number)) {
      Alert.alert("Lỗi", "Số điện thoại không đúng định dạng (10-11 chữ số).");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();

      formData.append("first_name", updatedUser.first_name);
      formData.append("last_name", updatedUser.last_name);
      formData.append("email", updatedUser.email);
      formData.append("phone_number", updatedUser.phone_number);

      if (avatarFile) {
        formData.append("avatar", {
          uri: avatarFile.uri,
          name: avatarFile.fileName ,
          type: avatarFile.mimeType ,
        });
      }

      const res = await Apis.patch(endpoints["current-user"], formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({
        type: "LOGIN",
        payload: res.data,
      });

      Alert.alert("Thành công", "Thông tin đã được cập nhật!");
      setIsEditing(false);
      setAvatarFile(null);
    } catch (ex) {
      console.error(ex.response?.data || ex);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = avatarFile ? avatarFile.uri : user?.avatar;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.white }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={Styles.header}>
        <Avatar.Image size={100} source={{ uri: displayAvatar }} />
        <Button
          icon="camera"
          mode="text"
          onPress={pickImage}
          disabled={!isEditing}
          textColor={Colors.primary}
        >
          Đổi ảnh đại diện
        </Button>
      </View>

      <View style={{ padding: 20 }}>
        <CustomInput
          label="Họ và tên đệm"
          icon="account-outline"
          value={updatedUser.first_name}
          onChangeText={(t) =>
            setUpdatedUser({ ...updatedUser, first_name: t })
          }
          disabled={!isEditing}
        />

        <CustomInput
          label="Tên"
          icon="account"
          value={updatedUser.last_name}
          onChangeText={(t) => setUpdatedUser({ ...updatedUser, last_name: t })}
          disabled={!isEditing}
        />

        <CustomInput
          label="Email"
          icon="email-outline"
          value={updatedUser.email}
          onChangeText={(t) => setUpdatedUser({ ...updatedUser, email: t })}
          disabled={!isEditing}
          keyboardType="email-address"
        />

        <CustomInput
          label="Số điện thoại"
          icon="phone-outline"
          value={updatedUser.phone_number}
          onChangeText={(t) =>
            setUpdatedUser({ ...updatedUser, phone_number: t })
          }
          disabled={!isEditing}
          keyboardType="phone-pad"
        />

        {!isEditing ? (
          <CustomButton title="Chỉnh sửa" onPress={() => setIsEditing(true)} />
        ) : (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <CustomButton
              title="Hủy"
              mode="outlined"
              onPress={() => {
                setIsEditing(false);
                setAvatarFile(null);
                setUpdatedUser({
                  first_name: user?.first_name || "",
                  last_name: user?.last_name || "",
                  phone_number: user?.phone_number || "",
                  email: user?.email || "",
                });
              }}
              style={{ width: "45%" }}
            />
            <CustomButton
              title="Lưu"
              onPress={handleUpdate}
              loading={loading}
              style={{ width: "45%" }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default UserDetail;
