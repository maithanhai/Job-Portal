import React, { useState, useContext } from "react";
import { View, Alert } from "react-native";
import { Modal, Portal, Text, TextInput, Icon } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/Contexts";
import Colors from "../../theme/Color";
import GlobalStyles from "../../style/Styles";
import ComponentStyles from "./Styles";
import CustomButton from "../common/CustomButton";

const ApplyJobButton = ({ jobId, isApplied, isExpired, onApplySuccess }) => {
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
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) setSelectedLocalFile(result.assets[0]);
    } catch (ex) {
      console.error("Lỗi chọn file:", ex);
    }
  };

  const handleApply = async () => {
    if (!selectedLocalFile)
      return Alert.alert("Thông báo", "Vui lòng chọn file CV từ thiết bị!");

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

      let res = await authApis(token).post(
        endpoints["applications"],
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 201 || res.status === 200) {
        Alert.alert("Thành công", "Hồ sơ của bạn đã được gửi đi!");
        setVisible(false);
        setSelectedLocalFile(null);
        setCoverLetter("");
        onApplySuccess();
      }
    } catch (ex) {
      if (ex.response?.status === 403) {
        Alert.alert("Thất bại", "Bạn không có quyền hoặc tài khoản bị hạn chế.");
      } else if (ex.response?.status === 400) {
        Alert.alert("Thông báo", "Bạn đã ứng tuyển vào vị trí này rồi.");
        setVisible(false);
        onApplySuccess();
      } else {
        Alert.alert("Lỗi", "Không thể nộp đơn lúc này.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <View>
      {user === null ? (
        <CustomButton
          title="Đăng nhập để ứng tuyển"
          mode="outlined"
          style={{ borderColor: Colors.primary }}
          onPress={() => nav.navigate("Login")}
        />
      ) : user.role === "CANDIDATE" ? (
        isExpired ? (
          <CustomButton 
            title="Đã hết hạn ứng tuyển" 
            mode="contained" 
            disabled 
            buttonColor={Colors.gray} 
          />
        ) : isApplied ? (
          <CustomButton 
            title="Đã ứng tuyển" 
            mode="contained" 
            disabled 
            buttonColor={Colors.gray} 
          />
        ) : (
          <CustomButton
            title="Ứng tuyển ngay"
            mode="contained"
            onPress={() => setVisible(true)}
          />
        )
      ) : (
        <CustomButton 
          title="Tài khoản HR không thể ứng tuyển" 
          mode="contained" 
          disabled 
          buttonColor={Colors.gray} 
        />
      )}
      
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={ComponentStyles.applyModalContainer}
        >
          <Text style={ComponentStyles.applyModalTitle}>
            Hồ sơ ứng tuyển
          </Text>

          <Text style={ComponentStyles.applyModalLabel}>
            Tải lên CV cá nhân:
          </Text>
          
          <CustomButton
            title={selectedLocalFile ? "Đổi file khác" : "Chọn file từ thiết bị (.pdf)"}
            mode="outlined"
            onPress={pickDocument}
            style={{
              marginBottom: 15,
              borderColor: selectedLocalFile ? Colors.status.accepted : Colors.primary,
            }}
            textColor={selectedLocalFile ? Colors.status.accepted : Colors.primary}
          />

          {selectedLocalFile && (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
              <Icon source="file-document-outline" size={20} color={Colors.primary} />
              <Text
                style={[
                  ComponentStyles.applyModalFileSelected, 
                  { marginLeft: 8, flex: 1, marginBottom: 0 }
                ]}
                numberOfLines={1}
              >
                Đã chọn: {selectedLocalFile.name}
              </Text>
            </View>
          )}

          <TextInput
            label="Lời nhắn (Không bắt buộc)"
            value={coverLetter}
            onChangeText={setCoverLetter}
            mode="outlined"
            multiline={true}
            numberOfLines={4}
            style={ComponentStyles.applyModalInput}
            activeOutlineColor={Colors.primary}
          />

          <View style={[{ flexDirection: "row", ...ComponentStyles.applyModalButtonRow }]}>
            <CustomButton
              title="Hủy"
              mode="outlined"
              onPress={() => setVisible(false)}
              style={ComponentStyles.applyModalButtonHalf}
              textColor={Colors.text.primary}
            />
            <CustomButton
              title="Nộp đơn"
              mode="contained"
              onPress={handleApply}
              loading={submitLoading}
              style={ComponentStyles.applyModalButtonHalf}
              disabled={!selectedLocalFile}
            />
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default ApplyJobButton;