import React, { useState, useContext } from "react";
import { View, Alert } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis,{authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
import Colors from "../../theme/Color";

const ApplyJobButton = ({ jobId, isApplied, onApplySuccess }) => {
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    const [visible, setVisible] = useState(false);
    const [selectedLocalFile, setSelectedLocalFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: [
                    "application/pdf", 
                    "application/msword", 
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ],
                copyToCacheDirectory: true
            });

            if (!result.canceled) {
                setSelectedLocalFile(result.assets[0]);
            }
        } catch (ex) {
            console.error("Lỗi chọn file:", ex);
        }
    };

    const handleApply = async () => {
        if (!selectedLocalFile) {
            Alert.alert("Thông báo", "Vui lòng chọn file CV từ thiết bị!");
            return;
        }

        try {
            setSubmitLoading(true);
            let token = await AsyncStorage.getItem("token");

            const formData = new FormData();
            formData.append("job", jobId);
            formData.append("cover_letter", coverLetter);
            formData.append("file_cv", {
                uri: selectedLocalFile.uri,
                name: selectedLocalFile.name,
                type: selectedLocalFile.mimeType || "application/pdf",
            });

            let res = await authApis(token).post(endpoints['applications'], formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });

            if (res.status === 201 || res.status === 200) {
                Alert.alert("Thành công", "Hồ sơ cá nhân của bạn đã được gửi đi thành công!");
                setVisible(false);
                setSelectedLocalFile(null);
                setCoverLetter("");
                onApplySuccess(); // Báo về cho JobDetail biết là nộp xong rồi để đổi màu nút
            }
        } catch (ex) {
            console.error(ex.response?.data || ex.message);
            if (ex.response?.status === 403) {
                Alert.alert("Thất bại", "Bạn không có quyền hoặc tài khoản bị hạn chế.");
            } else if (ex.response?.status === 400) {
                Alert.alert("Thông báo", "Bạn đã ứng tuyển vào vị trí này rồi.");
                setVisible(false);
                onApplySuccess(); // Lỡ nộp rồi thì cũng báo thành công để khóa nút
            } else {
                Alert.alert("Lỗi", "Không thể nộp đơn ứng tuyển lúc này.");
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <View>
            {user === null ? (
                <Button 
                    mode="outlined" 
                    textColor={Colors.primary}
                    style={{ borderColor: Colors.primary }}
                    onPress={() => nav.navigate("Login")}
                >
                    Đăng nhập để ứng tuyển
                </Button>
            ) : user.role === "CANDIDATE" ? (
                isApplied ? (
                    <Button mode="contained" disabled buttonColor={Colors.gray}>
                        Đã ứng tuyển
                    </Button>
                ) : (
                    <Button mode="contained" buttonColor={Colors.primary} onPress={() => setVisible(true)}>
                        Ứng tuyển ngay
                    </Button>
                )
            ) : (
                <Button mode="contained" disabled buttonColor={Colors.gray}>
                    Tài khoản HR không thể ứng tuyển
                </Button>
            )}

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{ backgroundColor: "white", padding: 20, margin: 20, borderRadius: 12 }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Hồ sơ ứng tuyển</Text>
                    
                    <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "#555" }}>Tải lên CV cá nhân:</Text>
                    <Button 
                        mode="outlined" 
                        icon="file-upload-outline" 
                        onPress={pickDocument}
                        style={{ marginBottom: 15, borderColor: selectedLocalFile ? "green" : Colors.primary }}
                        textColor={selectedLocalFile ? "green" : Colors.primary}
                    >
                        {selectedLocalFile ? "Đổi file khác" : "Chọn file từ thiết bị (.pdf, .doc)"}
                    </Button>

                    {selectedLocalFile && (
                        <Text style={{ color: "green", fontWeight: "bold", marginBottom: 15, textAlign: "center" }} numberOfLines={1}>
                            📄 Đã chọn: {selectedLocalFile.name}
                        </Text>
                    )}

                    <TextInput
                        label="Thư giới thiệu (Không bắt buộc)"
                        value={coverLetter}
                        onChangeText={setCoverLetter}
                        mode="outlined"
                        multiline={true}
                        numberOfLines={4}
                        style={{ marginBottom: 15, backgroundColor: "#fff" }}
                    />

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                        <Button mode="outlined" onPress={() => setVisible(false)} style={{ width: "45%" }}>
                            Hủy
                        </Button>
                        <Button 
                            mode="contained" 
                            buttonColor={Colors.primary} 
                            onPress={handleApply} 
                            loading={submitLoading}
                            style={{ width: "45%" }}
                            disabled={!selectedLocalFile}
                        >
                            Nộp đơn
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

export default ApplyJobButton;