import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import moment from "moment";
import 'moment/locale/vi';
import Apis, { authApis,endpoints } from "../../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../../../style/Styles";
import Colors from "../../../theme/Color";
import ApplyJobButton from "../../../components/candidate/ApplyJobButton";

const JobDetail = ({ route }) => {
    const jobId = route.params?.jobId;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false); 
    const { width } = useWindowDimensions();

    // Hàm format lương: 1000000 → "1tr", 1500000 → "1.5tr"
    const formatSalary = (salary) => {
        if (!salary) return "";
        const millions = salary / 1000000;
        if (millions % 1 === 0) {
            return `${millions}tr`;
        } else {
            return `${millions.toFixed(1)}tr`;
        }
    };

    // Format hiển thị lương
    const getSalaryText = () => {
        if (!job) return "Chưa cập nhật";
        
        if (job.is_negotiable) {
            return "Thỏa thuận";
        }
        if (job.salary_min && job.salary_max) {
            return `Lương từ ${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`;
        } else if (job.salary_min) {
            return `Lương từ ${formatSalary(job.salary_min)}`;
        }
        return "Chưa cập nhật";
    };

    const loadJobDetails = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem("token");
            
            let res;
            if (token) {
                res = await authApis(token).get(endpoints['job-details'](jobId));
            } else {
                res = await Apis.get(endpoints['job-details'](jobId));
            }

            setJob(res.data);
            if (res.data.is_applied) {
                setIsApplied(true);
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert("Lỗi", "Không thể tải thông tin công việc.");
        } finally {
            setLoading(false);
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
                            {getSalaryText()}
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

                {/* ĐÃ SỬA: Gọi Component ApplyJobButton ở đây cực kỳ sạch sẽ */}
                <View style={{ padding: 20, backgroundColor: "white" }}>
                    <ApplyJobButton 
                        jobId={jobId} 
                        isApplied={isApplied} 
                        onApplySuccess={() => setIsApplied(true)} 
                    />
                </View>

            </ScrollView>
        </View>
    );
};

export default JobDetail;