import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, ActivityIndicator, Card, Badge } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authApis, endpoints } from "../../../configs/Apis";
import CustomInput from "../../../components/common/CustomInput";
import CustomButton from "../../../components/common/CustomButton";
import Colors from "../../../theme/Color";
import GlobalStyles from "../../../style/Styles";
import LocalStyles from "./Styles";
import { MyUserContext } from "../../../configs/Contexts"; 

const EmployerProfile = () => {
  const [user, dispatch] = useContext(MyUserContext); 

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [employerData, setEmployerData] = useState({
    company_name: "",
    location: "",
    tax_code: "",
    is_verified: false,
  });
  const [originalData, setOriginalData] = useState({});

  const [employeeCardUri, setEmployeeCardUri] = useState(null);
  const [originalCardUri, setOriginalCardUri] = useState(null);
  const [localImageToUpload, setLocalImageToUpload] = useState(null);
  
  const [logoUri, setLogoUri] = useState(null);
  const [originalLogoUri, setOriginalLogoUri] = useState(null);
  const [localLogoToUpload, setLocalLogoToUpload] = useState(null);

  const loadEmployerProfile = async () => {
    try {
      setLoading(true);
      let token = await AsyncStorage.getItem("token");
      let res = await authApis(token).get(endpoints["current-employer"]);

      const fetchedData = {
        company_name: res.data.company_name || "",
        location: res.data.location || "",
        tax_code: res.data.tax_code || "",
        is_verified: res.data.is_verified || false,
      };

      setEmployerData(fetchedData);
      setOriginalData(fetchedData);
      
      if (res.data.employee_card) {
        setEmployeeCardUri(res.data.employee_card);
        setOriginalCardUri(res.data.employee_card);
      }
      if (res.data.logo_company) {
        setLogoUri(res.data.logo_company);
        setOriginalLogoUri(res.data.logo_company);
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployerProfile();
  }, []);

  const pickImage = async (type) => {
    if (!isEditing) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập ảnh.");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'logo' ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'logo') {
        setLogoUri(result.assets[0].uri);
        setLocalLogoToUpload(result.assets[0]);
      } else {
        setEmployeeCardUri(result.assets[0].uri);
        setLocalImageToUpload(result.assets[0]);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmployerData(originalData);
    setEmployeeCardUri(originalCardUri);
    setLogoUri(originalLogoUri);
    setLocalImageToUpload(null);
    setLocalLogoToUpload(null);
  };

  const handleUpdateProfile = async () => {
    if (!employerData.company_name || !employerData.location) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Tên công ty và Địa chỉ.");
    }
    try {
      setSubmitLoading(true);
      let token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("company_name", employerData.company_name);
      formData.append("location", employerData.location);
      if (employerData.tax_code) formData.append("tax_code", employerData.tax_code);
      
      if (localImageToUpload) {
        formData.append("employee_card", { uri: localImageToUpload.uri, name: "card.jpg", type: "image/jpeg" });
      }
      if (localLogoToUpload) {
        formData.append("logo_company", { uri: localLogoToUpload.uri, name: "logo.jpg", type: "image/jpeg" });
      }

      let res = await authApis(token).patch(endpoints["current-employer"], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200 || res.status === 204) {
        Alert.alert("Thành công", "Đã cập nhật!");
        const updatedData = { 
            ...employerData, 
            is_verified: false 
        };
        
        setEmployerData(updatedData);
        setOriginalData(updatedData);

        dispatch({
            type: "LOGIN",
            payload: { ...user, is_verified: false }
        });

        setLocalImageToUpload(null);
        setLocalLogoToUpload(null);
        setOriginalCardUri(employeeCardUri);
        setOriginalLogoUri(logoUri);
        setIsEditing(false);
      }
    } catch (ex) {
      Alert.alert("Thất bại", "Không thể cập nhật hồ sơ.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <View style={[GlobalStyles.container, GlobalStyles.rowCenter]}><ActivityIndicator size="large" color={Colors.primary} /></View>;

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={GlobalStyles.container}>
      <View style={LocalStyles.headerContainer}>
        <Badge size={28} style={[LocalStyles.badgePadding, { backgroundColor: employerData.is_verified ? Colors.status.accepted : Colors.status.pending }]}>
          {employerData.is_verified ? "Đã xác thực" : "Đang chờ duyệt"}
        </Badge>
      </View>

      <View style={GlobalStyles.padding}>
        <Card style={GlobalStyles.card}>
          <Card.Content>
            <TouchableOpacity style={LocalStyles.logoBox} onPress={() => pickImage('logo')} disabled={!isEditing}>
                <Image source={{ uri: logoUri}} style={LocalStyles.logoImage} />
                {isEditing && <Text style={{color: Colors.primary, marginTop: 5}}>Đổi ảnh công ty</Text>}
            </TouchableOpacity>

            <CustomInput label="Tên Công ty *" icon="domain" value={employerData.company_name} disabled={!isEditing} onChangeText={(t) => setEmployerData({ ...employerData, company_name: t })} />
            <CustomInput label="Địa chỉ Công ty *" icon="map-marker-outline" value={employerData.location} disabled={!isEditing} onChangeText={(t) => setEmployerData({ ...employerData, location: t })} />
            <CustomInput label="Mã số thuế doanh nghiệp" icon="barcode" value={employerData.tax_code} disabled={!isEditing} onChangeText={(t) => setEmployerData({ ...employerData, tax_code: t })} />

            <Text style={LocalStyles.imageLabel}>Ảnh Thẻ nhân viên:</Text>
            <TouchableOpacity style={[LocalStyles.imageUploadBox, !isEditing && LocalStyles.imageUploadBoxDisabled]} onPress={() => pickImage('card')} disabled={!isEditing}>
              {employeeCardUri ? <Image source={{ uri: employeeCardUri }} style={LocalStyles.previewImage} /> : <Text>Chọn ảnh thẻ</Text>}
            </TouchableOpacity>

            {!isEditing ? (
              <CustomButton title="Chỉnh sửa thông tin" onPress={() => setIsEditing(true)} />
            ) : (
              <View style={GlobalStyles.rowBetween}>
                <CustomButton title="Hủy" mode="outlined" onPress={handleCancel} style={LocalStyles.btnHalf} />
                <CustomButton title="Lưu" onPress={handleUpdateProfile} loading={submitLoading} style={LocalStyles.btnHalf} />
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default EmployerProfile;