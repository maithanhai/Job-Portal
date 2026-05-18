import React, { useContext, useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Avatar, TextInput, Button } from "react-native-paper";
import { MyUserContext } from "../../configs/Contexts";
import Apis, { endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
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
                    name: avatarFile.fileName || "avatar.jpg",
                    type: avatarFile.mimeType || "image/jpeg",
                });
            }

            const res = await Apis.patch(endpoints['current-user'], formData, {
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
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={Styles.header}>
                <Avatar.Image 
                    size={100} 
                    source={{ uri: displayAvatar }} 
                />
                <Button 
                    icon="camera" 
                    mode="text" 
                    onPress={pickImage} 
                    disabled={!isEditing}
                >
                    Đổi ảnh đại diện
                </Button>
            </View>

            <View style={{ padding: 20 }}>
                <TextInput
                    label="Họ và tên đệm"
                    value={updatedUser.first_name}
                    onChangeText={(t) => setUpdatedUser({ ...updatedUser, first_name: t })}
                    mode="outlined"
                    disabled={!isEditing}
                    style={Styles.input}
                />
                <TextInput
                    label="Tên"
                    value={updatedUser.last_name}
                    onChangeText={(t) => setUpdatedUser({ ...updatedUser, last_name: t })}
                    mode="outlined"
                    disabled={!isEditing}
                    style={Styles.input}
                />
                <TextInput
                    label="Email"
                    value={updatedUser.email}
                    onChangeText={(t) => setUpdatedUser({ ...updatedUser, email: t })}
                    mode="outlined"
                    disabled={!isEditing}
                    style={Styles.input}
                />
                <TextInput
                    label="Số điện thoại"
                    value={updatedUser.phone_number}
                    onChangeText={(t) => setUpdatedUser({ ...updatedUser, phone_number: t })}
                    mode="outlined"
                    disabled={!isEditing}
                    style={Styles.input}
                />

                {!isEditing ? (
                    <Button
                        mode="contained"
                        onPress={() => setIsEditing(true)}
                        style={Styles.btn}
                        buttonColor={Colors.primary}
                    >
                        Chỉnh sửa
                    </Button>
                ) : (
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Button
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
                            style={[Styles.btn, { width: "45%" }]}
                        >
                            Hủy
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleUpdate}
                            loading={loading}
                            style={[Styles.btn, { width: "45%" }]}
                            buttonColor={Colors.primary}
                        >
                            Lưu
                        </Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default UserDetail;