import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { Text, Card, Checkbox, Portal, Modal, List, HelperText } from "react-native-paper";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import Apis, { authApis, endpoints } from "../../../configs/Apis";
import CustomInput from "../../../components/common/CustomInput";
import CustomButton from "../../../components/common/CustomButton";
import Colors from "../../../theme/Color";
import GlobalStyles from "../../../style/Styles";
import ScreenStyles from "./Styles";

const JobForm = ({ route }) => {
  const nav = useNavigation();
  const richText = useRef(); 
  const requirementsRef = useRef();
  const benefitsRef = useRef();
  const jobData = route.params?.jobData;
  const isEditMode = !!jobData;

  const [submitLoading, setSubmitLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");

  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    name: jobData?.name || "",
    location: jobData?.location || "",
    salary_min: jobData?.salary_min ? jobData.salary_min.toString() : "",
    salary_max: jobData?.salary_max ? jobData.salary_max.toString() : "",
    is_negotiable: jobData?.is_negotiable || false,
    description: jobData?.description || "",
    requirements: jobData?.requirements || "",
    benefits: jobData?.benefits || "",
    category_id: jobData?.category?.id ? jobData.category.id.toString() : "1",
    deadline: jobData?.deadline ? new Date(jobData.deadline) : new Date(),
  });

  useEffect(() => {
    loadCategories();
  }, []); 

  const loadCategories = async () => {
    try {
      let res = await Apis.get(endpoints["categories"]);
      setCategories(res.data);
    } catch (ex) { 
      console.error("Lỗi tải danh mục", ex); 
    }
  };

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (err) setErr("");
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.deadline;
    setShowDatePicker(Platform.OS === 'ios');
    handleChange('deadline', currentDate);
  };

  const validate = () => {
    if (!formData.name || !formData.location || !formData.description) {
      setErr("Vui lòng nhập đầy đủ Tên vị trí, Địa điểm và Mô tả công việc!");
      return false;
    }

    if (!formData.is_negotiable) {
      const min = parseInt(formData.salary_min) || 0;
      const max = parseInt(formData.salary_max) || 0;

      if (max > 0 && min >= max) {
        setErr("Mức lương tối đa bắt buộc phải lớn hơn mức lương tối thiểu!");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitLoading(true);
      let token = await AsyncStorage.getItem("token");

      const parsedSalaryMin = parseInt(formData.salary_min);
      const parsedSalaryMax = parseInt(formData.salary_max);

      const body = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements || null,
        benefits: formData.benefits || null,
        is_negotiable: formData.is_negotiable,
        category: parseInt(formData.category_id) || 1,
        salary_min: formData.is_negotiable ? null : (isNaN(parsedSalaryMin) ? null : parsedSalaryMin),
        salary_max: formData.is_negotiable ? null : (isNaN(parsedSalaryMax) ? null : parsedSalaryMax),
        deadline: formData.deadline ? formData.deadline.toISOString() : null, 
      };

      let res = isEditMode 
        ? await authApis(token).patch(endpoints["job-details"](jobData.id), body)
        : await authApis(token).post(endpoints["jobs"], body);

      if (res.status === 200 || res.status === 201) {
        Alert.alert("Thành công", isEditMode ? "Đã cập nhật bài đăng!" : "Đã đăng tin mới!");
        nav.goBack();
      }
    } catch (ex) { 
        if (ex.response?.status === 401) {
            setErr("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        } else if (ex.response?.status === 400) {
            const errorData = ex.response.data;
            let errorMsg = "Kiểm tra lại dữ liệu!";
            if (errorData.salary_max) errorMsg = `Lỗi Lương: ${errorData.salary_max[0]}`;
            else if (errorData.category) errorMsg = `Lỗi Danh mục: ${errorData.category[0]}`;

            setErr(`Thất bại: ${errorMsg}`);
        } else {
            setErr("Thất bại! Vui lòng kiểm tra lại thông tin.");
        }
    } finally { 
      setSubmitLoading(false); 
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={ScreenStyles.formContainer}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={ScreenStyles.header}>
          <Text variant="headlineSmall" style={ScreenStyles.headerTitle}>
            {isEditMode ? "Sửa tin tuyển dụng " : "Đăng tin mới "}
          </Text>
        </View>

        <View style={GlobalStyles.padding}>
          <Card style={ScreenStyles.card}>
            <Card.Content>
              
              {err ? (
                <HelperText type="error" visible={true} style={ScreenStyles.helperText}>
                  {err}
                </HelperText>
              ) : null}

              <CustomInput label="Tên vị trí tuyển dụng" icon="briefcase-outline" value={formData.name} onChangeText={(t) => handleChange('name', t)} />
              <CustomInput label="Địa điểm làm việc" icon="map-marker-outline" value={formData.location} onChangeText={(t) => handleChange('location', t)} />

              <View style={ScreenStyles.rowWrapper}>
                <TouchableOpacity style={ScreenStyles.halfInput} onPress={() => setModalCategoryVisible(true)} activeOpacity={0.8}>
                  <View pointerEvents="none">
                    <CustomInput label="Ngành nghề" icon="format-list-bulleted" value={categories.find(c => c.id.toString() === formData.category_id)?.name || "Chọn..."} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={ScreenStyles.halfInput} onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                  <View pointerEvents="none">
                    <CustomInput label="Hạn nộp CV" icon="calendar-outline" value={moment(formData.deadline).format("DD/MM/YYYY")} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={ScreenStyles.editorContainer}>
                <Text style={ScreenStyles.editorLabel}>Mô tả công việc chi tiết</Text>
                <RichToolbar 
                  editor={richText} 
                  actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList, actions.insertOrderedList]} 
                  style={ScreenStyles.toolbar} 
                  iconTint="#555" 
                  selectedIconTint={Colors.primary} 
                />
                
                <RichEditor
                  ref={richText}
                  initialContentHTML={isEditMode ? jobData.description : ""}
                  onChange={(text) => handleChange('description', text)}
                  placeholder="Nhập mô tả tại đây..."
                  style={ScreenStyles.richEditor}
                  initialHeight={250}
                  editorInitializedCallback={() => {
                    if (isEditMode && jobData?.description) {
                      setTimeout(() => {
                        richText.current?.setContentHTML(jobData.description);
                      }, 200); 
                    }
                  }}
                />
              </View>

              <View style={ScreenStyles.editorContainer}>
                <Text style={ScreenStyles.editorLabel}>Yêu cầu công việc</Text>
                <RichToolbar 
                  editor={requirementsRef} 
                  actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList, actions.insertOrderedList]} 
                  style={ScreenStyles.toolbar} 
                  iconTint="#555" 
                  selectedIconTint={Colors.primary} 
                />
                <RichEditor
                  ref={requirementsRef}
                  initialContentHTML={isEditMode ? jobData.requirements : ""}
                  onChange={(text) => handleChange('requirements', text)}
                  placeholder="Nhập yêu cầu công việc..."
                  style={ScreenStyles.richEditor}
                  initialHeight={200}
                  editorInitializedCallback={() => {
                    if (isEditMode && jobData?.requirements) {
                      setTimeout(() => {
                        requirementsRef.current?.setContentHTML(jobData.requirements);
                      }, 200); 
                    }
                  }}
                />
              </View>

              <View style={ScreenStyles.editorContainer}>
                <Text style={ScreenStyles.editorLabel}>Quyền lợi</Text>
                <RichToolbar 
                  editor={benefitsRef} 
                  actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList, actions.insertOrderedList]} 
                  style={ScreenStyles.toolbar} 
                  iconTint="#555" 
                  selectedIconTint={Colors.primary} 
                />
                <RichEditor
                  ref={benefitsRef}
                  initialContentHTML={isEditMode ? jobData.benefits : ""}
                  onChange={(text) => handleChange('benefits', text)}
                  placeholder="Nhập quyền lợi và phúc lợi..."
                  style={ScreenStyles.richEditor}
                  initialHeight={200}
                  editorInitializedCallback={() => {
                    if (isEditMode && jobData?.benefits) {
                      setTimeout(() => {
                        benefitsRef.current?.setContentHTML(jobData.benefits);
                      }, 200); 
                    }
                  }}
                />
              </View>
              <View style={ScreenStyles.checkboxRow}>
                <Checkbox status={formData.is_negotiable ? "checked" : "unchecked"} onPress={() => handleChange('is_negotiable', !formData.is_negotiable)} color={Colors.primary} />
                <Text style={ScreenStyles.checkboxLabel}>Mức lương thỏa thuận</Text>
              </View>

              {!formData.is_negotiable && (
                <View style={ScreenStyles.rowWrapper}>
                  <CustomInput label="Lương tối thiểu (VNĐ)" icon="currency-usd" value={formData.salary_min} onChangeText={(t) => handleChange('salary_min', t)} keyboardType="numeric" style={ScreenStyles.halfInput} />
                  <CustomInput label="Lương tối đa (VNĐ)" icon="currency-usd" value={formData.salary_max} onChangeText={(t) => handleChange('salary_max', t)} keyboardType="numeric" style={ScreenStyles.halfInput} />
                </View>
              )}

              <CustomButton title={isEditMode ? "Cập nhật bài đăng" : "Đăng tin ngay"} onPress={handleSubmit} loading={submitLoading} />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker value={formData.deadline} mode="date" display="default" minimumDate={new Date()} onChange={handleDateChange} />
      )}

      <Portal>
        <Modal visible={modalCategoryVisible} onDismiss={() => setModalCategoryVisible(false)} contentContainerStyle={ScreenStyles.modalContent}>
          <Text variant="titleMedium" style={{ textAlign: "center", marginBottom: 15, fontWeight: "bold", color: Colors.text.primary }}>Chọn Ngành Nghề</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {categories.map((c, index) => (
              <List.Item key={`cat-${c.id}-${index}`} title={c.name} onPress={() => { handleChange('category_id', c.id.toString()); setModalCategoryVisible(false); }} />
            ))}
          </ScrollView>
        </Modal>
      </Portal>

    </KeyboardAvoidingView>
  );
};

export default JobForm;