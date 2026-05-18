import React, { useEffect, useState, useContext } from "react";
import { ScrollView, View, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { Card, Text, Button, Divider, Modal, Portal, TextInput } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import * as DocumentPicker from "expo-document-picker";
import moment from "moment";
import 'moment/locale/vi';
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { MyUserContext } from "../../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../../../style/Styles";
import Colors from "../../../theme/Color";

const JobDetail = ({ route, navigation }) => {
    const jobId = route.params?.jobId;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user] = useContext(MyUserContext);
    const { width } = useWindowDimensions();

    const [visible, setVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    const loadJobDetails = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['job-details'](jobId));
            setJob(res.data);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Không thể tải thông tin công việc.");
        } finally {
            setLoading(false);
        }
    };

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
                copyToCacheDirectory: true
            });

            if (!result.canceled) {
                setSelectedFile(result.assets[0]);
            }
        } catch (ex) {
            console.error("Lỗi chọn file:", ex);
        }
    };

    const handleApply = async () => {
        if (!selectedFile) {
            Alert.alert("Thông báo", "Vui lòng chọn file CV từ thiết bị!");
            return;
        }

        try {
            setSubmitLoading(true);
            let token = await AsyncStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };

            // BƯỚC 1: Upload file CV lên API /resumes/ để tạo bản ghi Resume
            const resumeFormData = new FormData();
            resumeFormData.append("name", selectedFile.name);
            resumeFormData.append("file", {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.mimeType || "application/pdf",
            });

            let resumeRes = await authApis(token).post(endpoints['resumes'], resumeFormData, { headers });
            const newResumeId = resumeRes.data.id;

            // BƯỚC 2: Sử dụng ID Resume mới tạo để tiến hành gửi đơn ứng tuyển
            let applicationRes = await authApis(token).post(endpoints['applications'], {
                "job": jobId,
                "resume": newResumeId,
                "cover_letter": coverLetter
            });

            if (applicationRes.status === 201 || applicationRes.status === 200) {
                Alert.alert("Thành công", "Hồ sơ cá nhân của bạn đã được gửi đi thành công!");
                setVisible(false);
                setSelectedFile(null);
                setCoverLetter("");
            }
        } catch (ex) {
            console.error(ex.response?.data || ex.message);
            if (ex.response?.status === 403) {
                Alert.alert("Thất bại", "Bạn đã ứng tuyển vào vị trí này rồi hoặc không có quyền ứng tuyển.");
            } else {
                Alert.alert("Lỗi", "Không thể nộp đơn ứng tuyển lúc này.");
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) {
            loadJobDetails();
        }
    }, [jobId]);

    if (loading) {
        return (
            <View style={[Styles.container, { justifyContent: "center" }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!job) {
        return (
            <View style={[Styles.container, Styles.padding]}>
                <Text>Không tìm thấy thông tin công việc.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <ScrollView style={Styles.container} showsVerticalScrollIndicator={false}>
                <Card style={{ backgroundColor: "white", borderRadius: 0 }}>
                    <Card.Title 
                        title={job.name} 
                        titleStyle={{ fontWeight: "bold", fontSize: 22, color: Colors.primary }}
                        subtitle={job.employer?.company_name || "Công ty ẩn danh"}
                        subtitleStyle={{ fontSize: 16 }}
                    />
                    <Card.Content>
                        <Text variant="titleMedium" style={{ color: "#d32f2f", fontWeight: "bold", marginBottom: 10 }}>
                            Mức lương: {job.is_negotiable ? "Thỏa thuận" : `${job.salary_min} - ${job.salary_max} VNĐ`}
                        </Text>
                        
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <Text style={{ fontWeight: "bold" }}>📍 Địa điểm: </Text>
                            <Text>{job.location || "Chưa cập nhật"}</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <Text style={{ fontWeight: "bold" }}>⏳ Hạn nộp: </Text>
                            <Text>{job.deadline ? moment(job.deadline).format("DD/MM/YYYY") : "Chưa cập nhật"}</Text>
                        </View>
                    </Card.Content>
                </Card>

                <View style={[Styles.padding, { backgroundColor: "white", marginTop: 10 }]}>
                    <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 10, color: "#333" }}>
                        Mô tả công việc
                    </Text>
                    <Divider style={{ marginBottom: 15 }} />
                    
                    {job.description ? (
                        <RenderHTML 
                            contentWidth={width}
                            source={{ html: job.description }} 
                        />
                    ) : (
                        <Text style={{ color: "#666" }}>Chưa có mô tả chi tiết.</Text>
                    )}
                </View>

                <View style={{ padding: 20, backgroundColor: "white" }}>
                    {user === null ? (
                        <Button 
                            mode="outlined" 
                            textColor={Colors.primary}
                            style={{ borderColor: Colors.primary }}
                            onPress={() => navigation.navigate("Login")}
                        >
                            Đăng nhập để ứng tuyển
                        </Button>
                    ) : user.role === "CANDIDATE" ? (
                        <Button 
                            mode="contained" 
                            buttonColor={Colors.primary}
                            onPress={() => setVisible(true)}
                        >
                            Ứng tuyển ngay
                        </Button>
                    ) : (
                        <Button 
                            mode="contained" 
                            disabled
                            buttonColor={Colors.gray}
                        >
                            Tài khoản HR không thể ứng tuyển
                        </Button>
                    )}
                </View>
            </ScrollView>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={{ backgroundColor: "white", padding: 20, margin: 20, borderRadius: 12 }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>Hồ sơ ứng tuyển</Text>
                    
                    <Button 
                        mode="outlined" 
                        icon="file-upload-outline" 
                        onPress={pickDocument}
                        style={{ marginBottom: 10, borderColor: Colors.primary }}
                        textColor={Colors.primary}
                    >
                        Chọn file CV từ thiết bị
                    </Button>

                    {selectedFile && (
                        <Text style={{ color: "green", fontWeight: "bold", marginBottom: 15, textAlign: "center" }} numberOfLines={1}>
                            📄 Đã chọn: {selectedFile.name}
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
                            disabled={!selectedFile}
                        >
                            Nộp đơn
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

export default JobDetail;