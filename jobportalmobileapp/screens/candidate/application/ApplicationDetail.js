import React, { useState, useEffect } from "react";
import { View, ScrollView, Linking, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Avatar, Card, Surface, ActivityIndicator, Icon } from "react-native-paper";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Apis,{ authApis, endpoints } from "../../../configs/Apis";
import Colors from "../../../theme/Color";
import ScreenStyles from "./Styles";
import CustomButton from "../../../components/common/CustomButton"; 

const { height: screenHeight } = Dimensions.get("window");

const ApplicationDetail = ({ route, navigation }) => {
  const applicationId = route.params?.applicationId; 
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: "Chi tiết Đơn ứng tuyển" });
  }, [navigation]);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);
        let token = await AsyncStorage.getItem("token");
        let res = await authApis(token).get(`${endpoints['applications']}${applicationId}/`); 
        setApp(res.data);
      } catch (ex) {
        Alert.alert("Lỗi", "Không thể tải chi tiết đơn ứng tuyển.");
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationDetail();
    }
  }, [applicationId]);

  const getStatusColor = (status) => {
    switch (status) {
        case 'ACCEPTED': return Colors.status.accepted;
        case 'REJECTED': return Colors.status.rejected;
        case 'REVIEWING': return Colors.status.reviewing;
        default: return Colors.status.pending;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
        case 'ACCEPTED': return "Đã chấp nhận";
        case 'REJECTED': return "Đã từ chối";
        case 'REVIEWING': return "Nhà tuyển dụng đang xem";
        default: return "Đã nộp thành công";
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10, color: 'gray' }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!app) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
        <Text style={{ color: 'gray' }}>Không tìm thấy thông tin đơn ứng tuyển.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={ScreenStyles.safeAreaDetail} edges={["bottom"]}>
      <Surface style={ScreenStyles.profileHeader} elevation={1}>

        <Avatar.Image 
          size={60} 
          source={app.avatar ? { uri: app.avatar } : require('../../../assets/default-avatar.webp')} 
        />

        <View style={ScreenStyles.headerRight}>
          <Text style={ScreenStyles.candidateName} numberOfLines={1}>
            {app.full_name || "Ứng viên ẩn danh"}
          </Text>
          <Text style={ScreenStyles.jobName} numberOfLines={1}>
            Ứng tuyển: {app.job_name || "Tin tuyển dụng"}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Icon source="circle" size={10} color={getStatusColor(app.status)} />
            <Text style={[ScreenStyles.statusText, { color: getStatusColor(app.status), fontWeight: 'bold', marginLeft: 4 }]}>
              Trạng thái: {getStatusText(app.status)}
            </Text>
          </View>
        </View>
      </Surface>

      <ScrollView style={{ padding: 15 }} showsVerticalScrollIndicator={false}>

        <Text style={ScreenStyles.sectionTitle}>Lời nhắn của bạn</Text>
        <Card style={ScreenStyles.messageCard} elevation={0}>
          <Card.Content>
            <Text style={[ScreenStyles.message, !app.cover_letter && { fontStyle: 'italic', color: 'gray' }]}>
              {app.cover_letter || "Không có lời nhắn đính kèm."}
            </Text>
          </Card.Content>
        </Card>

        {app.review_comment ? (
          <View style={{ marginTop: 15 }}>
            <Text style={ScreenStyles.sectionTitle}>Phản hồi từ Nhà tuyển dụng</Text>
            <Card style={[ScreenStyles.messageCard, { backgroundColor:Colors.white, borderColor: Colors.borderColor, borderWidth: 1 }]} elevation={0}>
              <Card.Content>
                <Text style={[ScreenStyles.message, { fontStyle: 'normal', color: '#0369a1', fontWeight: '500' }]}>
                  {app.review_comment}
                </Text>
              </Card.Content>
            </Card>
          </View>
        ) : null}

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 10 }}>
          <Text style={ScreenStyles.sectionTitle}>CV đính kèm</Text>

          <CustomButton 
            title="Mở trình duyệt"
            mode="text" 
            icon="open-in-new"
            textColor={Colors.primary} 
            onPress={() => app.file_cv && Linking.openURL(app.file_cv)}
          />
        </View>

        <View style={[ScreenStyles.cvBox, { height: screenHeight * 0.6, marginBottom: 40, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' }]}>
          {app.file_cv ? (
            <WebView
              source={{ uri: `https://docs.google.com/viewer?url=${encodeURIComponent(app.file_cv)}&embedded=true` }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                      <ActivityIndicator size="large" color={Colors.primary} />
                      <Text style={{ marginTop: 10, color: 'gray' }}>Đang tải tài liệu PDF...</Text>
                  </View>
              )}
              scalesPageToFit={true}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:Colors.white }}>
               <Text style={{ color: 'gray' }}>Không có tệp đính kèm.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplicationDetail;