import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, Linking, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Avatar, Card, Surface, ActivityIndicator, Icon } from "react-native-paper"; 
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApis, endpoints } from "../../../configs/Apis";
import CustomButton from "../../../components/common/CustomButton";
import CustomInput from "../../../components/common/CustomInput"; 
import Colors from "../../../theme/Color";
import ScreenStyles from "./Styles";

const { height: screenHeight } = Dimensions.get("window");

const CandidateDetail = ({ route, navigation }) => {
  const { applicationId } = route.params; 
  
  const [app, setApp] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); 
  const [comment, setComment] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: "Hồ sơ Ứng viên" });
  }, [navigation]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        let token = await AsyncStorage.getItem("token");
        let res = await authApis(token).get(`${endpoints["applications"]}${applicationId}/`);
        setApp(res.data);
        setComment(res.data.review_comment || "");

        if (res.data.status === "PENDING") {
           await authApis(token).patch(endpoints["application-status"](applicationId), { status: "REVIEWING" });
           setApp(prev => ({ ...prev, status: "REVIEWING" }));
        }
      } catch (ex) {
        Alert.alert("Lỗi", "Không thể tải thông tin chi tiết.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [applicationId]);

  const updateAPI = async (dataToUpdate, successMessage = null) => {
    setActionLoading(true);
    try {
      let token = await AsyncStorage.getItem("token");
      await authApis(token).patch(endpoints["application-status"](applicationId), dataToUpdate);
      
      setApp((prev) => ({ ...prev, ...dataToUpdate }));

      if (successMessage) {
        Alert.alert("Thông báo", successMessage, [
            { text: "OK", onPress: () => successMessage.includes("ứng viên") && navigation.goBack() }
        ]);
      }
    } catch (ex) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
        case 'ACCEPTED': return { color: Colors.status.accepted, text: "Đã chấp nhận", icon: "check-circle" };
        case 'REJECTED': return { color: Colors.status.rejected, text: "Đã từ chối", icon: "close-circle" };
        case 'REVIEWING': return { color: Colors.status.reviewing, text: "Đang xem xét", icon: "eye" };
        default: return { color: Colors.status.pending, text: "Chờ duyệt", icon: "clock-outline" };
    }
  };

  if (loading || !app) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg.lightest }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10, color: 'gray' }}>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  const statusConfig = getStatusConfig(app.status);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg.lightest }} edges={["bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>

        <Surface style={[ScreenStyles.profileHeader, { borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 20 }]} elevation={0}>
          <Avatar.Image 
            size={65} 
            source={app.avatar ? { uri: app.avatar } : require('../../../assets/default-avatar.webp')} 
          /> 
          <View style={ScreenStyles.headerRight}>
            <Text style={[ScreenStyles.candidateName, { fontSize: 20 }]}>
              {app.full_name || "Ứng viên ẩn danh"} 
            </Text>
            <Text style={[ScreenStyles.jobName, { marginBottom: 6 }]}>Ứng tuyển: {app.job_name}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: statusConfig.color + '15', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Icon source={statusConfig.icon} size={14} color={statusConfig.color} />
              <Text style={{ fontSize: 12, color: statusConfig.color, fontWeight: "bold", marginLeft: 4 }}>
                {statusConfig.text}
              </Text>
            </View>
          </View>
        </Surface>

        <ScrollView style={{ padding: 15 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon source="message-text-outline" size={20} color={Colors.text.secondary} />
            <Text style={[ScreenStyles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>Lời nhắn của ứng viên</Text>
          </View>
          <Card style={[ScreenStyles.messageCard, { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1 }]} elevation={0}>
            <Card.Content>
              <Text style={[ScreenStyles.message, !app.cover_letter && { fontStyle: 'italic', color: '#94a3b8' }]}>
                {app.cover_letter || "Ứng viên không đính kèm lời nhắn."}
              </Text>
            </Card.Content>
          </Card>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 8 }}>
            <Icon source="notebook-edit-outline" size={20} color={Colors.text.secondary} />
            <Text style={[ScreenStyles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>Đánh giá</Text>
          </View>
          <CustomInput
            label="Ghi chú về năng lực, phỏng vấn..."
            value={comment}
            onChangeText={setComment}
            multiline={true}
            numberOfLines={4}
            icon="comment-edit-outline"
          />
          <CustomButton 
            title="Lưu ghi chú"
            mode="contained" 
            buttonColor={Colors.primary}
            loading={actionLoading}
            onPress={() => updateAPI({ review_comment: comment }, "Đã lưu ghi chú thành công!")}
            style={{ alignSelf: 'flex-end', marginTop: 5, marginBottom: 20, width: 150 }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source="file-document-outline" size={20} color={Colors.text.secondary} />
              <Text style={[ScreenStyles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>CV ứng viên</Text>
            </View>
            <CustomButton 
              title="Mở tab mới"
              mode="text" 
              icon="open-in-new"
              textColor={Colors.primary}
              onPress={() => app.file_cv && Linking.openURL(app.file_cv)}
              style={{ paddingHorizontal: 0 }}
            />
          </View>
          
          <View style={[ScreenStyles.cvBox, { height: screenHeight * 0.6, marginBottom: 40, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' }]}>
            {app.file_cv ? (
              <WebView
                source={{ uri: `https://docs.google.com/viewer?url=${encodeURIComponent(app.file_cv)}&embedded=true` }}
                startInLoadingState={true}
                scalesPageToFit={true}
                renderLoading={() => (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={{ marginTop: 10, color: 'gray' }}>Đang tải CV ứng viên</Text>
                    </View>
                )}
              />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
                 <Text style={{ color: 'gray' }}>Không có tệp đính kèm.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {(app.status === "REVIEWING" || app.status === "PENDING") && (
          <Surface style={{ flexDirection: 'row', padding: 15, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#f1f5f9', gap: 10 }} elevation={4}>
            <CustomButton
              title="Từ chối"
              onPress={() => updateAPI({ status: "REJECTED", review_comment: comment }, "Đã từ chối ứng viên này!")}
              loading={actionLoading}
              mode="outlined"
              textColor={Colors.status.rejected}
              style={{ borderColor: Colors.status.rejected, flex: 1 }}
              icon="close-circle-outline"
            />
            <CustomButton
              title="Chấp nhận"
              onPress={() => updateAPI({ status: "ACCEPTED", review_comment: comment }, "Đã chấp nhận ứng viên này!")}
              loading={actionLoading}
              buttonColor={Colors.status.accepted}
              style={{ flex: 1 }}
              icon="check-circle"
            />
          </Surface>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CandidateDetail;