import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { Card, Text, Divider, Chip, Icon } from "react-native-paper"; 
import RenderHTML from "react-native-render-html";
import moment from "moment";
import 'moment/locale/vi';
import Apis, { authApis, endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../../style/Styles";
import Colors from "../../theme/Color";
import ApplyJobButton from "../../components/candidate/ApplyJobButton";
import CustomButton from "../common/CustomButton";

const JobDetail = ({ route, nav }) => {
    const jobId = route.params?.jobId;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const { width } = useWindowDimensions();

    const formatSalary = (salary) => {
        if (!salary) return "";
        const millions = salary / 1000000;
        return millions % 1 === 0 ? `${millions}tr` : `${millions.toFixed(1)}tr`;
    };

    const getSalaryText = () => {
        if (!job) return "Chưa cập nhật";
        if (job.is_negotiable) return "Thỏa thuận";
        if (job.salary_min && job.salary_max) return `Lương từ ${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)}`;
        if (job.salary_min) return `Lương từ ${formatSalary(job.salary_min)}`;
        return "Chưa cập nhật";
    };

    const loadJobDetails = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem("token");
            let user = await AsyncStorage.getItem("user");
            if (user) setUserRole(JSON.parse(user).role);

            let res = token 
                ? await authApis(token).get(endpoints['job-details'](jobId))
                : await Apis.get(endpoints['job-details'](jobId));

            setJob(res.data);
            setIsApplied(res.data.is_applied || false);
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể tải thông tin công việc.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) loadJobDetails();
    }, [jobId]);

    if (loading) return <View style={[Styles.container, { justifyContent: "center" }]}><ActivityIndicator size="large" color={Colors.primary} /></View>;
    if (!job) return <View style={[Styles.container, Styles.padding]}><Text>Không tìm thấy công việc.</Text></View>;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <ScrollView style={Styles.container} showsVerticalScrollIndicator={false}>
                <Card style={{ backgroundColor: Colors.white, borderRadius: 0 }}>
                    <Card.Title 
                        title={job.name} 
                        titleStyle={{ fontWeight: "bold", fontSize: 20, color: Colors.primary }} 
                        subtitle={job.employer?.company_name || "Công ty ẩn danh"} 
                    />
                    <Card.Content>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                            <Icon source="cash-multiple" size={22} color={Colors.salary.primary} />
                            <Text variant="titleMedium" style={{ color: Colors.salary.primary, fontWeight: "bold", marginLeft: 6 }}>
                                {getSalaryText()}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                            <Icon source="map-marker-outline" size={20} color={Colors.text.primary} />
                            <Text style={{ fontWeight: "bold", marginLeft: 6 }}>Địa điểm: </Text>
                            <Text style={{ flex: 1, flexWrap: 'wrap' }}>{job.location || "Chưa cập nhật"}</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                            <Icon 
                                source="calendar-clock-outline" 
                                size={20} 
                                color={job.is_expired ? Colors.text.error : Colors.text.primary} 
                            />
                            <Text style={{ fontWeight: "bold", marginLeft: 6 }}>Hạn nộp: </Text>
                            <Text style={{ color: job.is_expired ? Colors.text.error : Colors.text.primary, fontWeight: job.is_expired ? 'bold' : 'normal' }}>
                                {job.deadline ? moment(job.deadline).format("DD/MM/YYYY") : "Chưa cập nhật"} {job.is_expired ? "(Đã hết hạn)" : ""}
                            </Text>
                        </View>

                    </Card.Content>
                </Card>

                <View style={[Styles.padding, { backgroundColor: "white", marginTop: 10 }]}>
                    <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 10, color: Colors.text.primary }}>
                        Mô tả công việc
                    </Text>
                    <Divider style={{ marginBottom: 15 }} />
                    <RenderHTML 
                        contentWidth={width} 
                        source={{ html: job.description || "<p>Chưa có mô tả</p>" }} 
                    />
                </View>

                {job.requirements && (
                    <View style={[Styles.padding, { backgroundColor: "white", marginTop: 10 }]}>
                        <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 10, color: Colors.text.primary }}>
                            Yêu cầu ứng viên
                        </Text>
                        <Divider style={{ marginBottom: 15 }} />
                        <RenderHTML 
                            contentWidth={width} 
                            source={{ html: job.requirements }} 
                        />
                    </View>
                )}

                {job.benefits && (
                    <View style={[Styles.padding, { backgroundColor: "white", marginTop: 10 }]}>
                        <Text variant="titleLarge" style={{ fontWeight: "bold", marginBottom: 10, color: Colors.text.primary }}>
                            Quyền lợi
                        </Text>
                        <Divider style={{ marginBottom: 15 }} />
                        <RenderHTML 
                            contentWidth={width} 
                            source={{ html: job.benefits }} 
                        />
                    </View>
                )}

                <View style={{ padding: 20, backgroundColor: Colors.white }}>
                    {userRole === 'EMPLOYER' ? (
                        <CustomButton 
                            title="Chỉnh sửa tin đăng"
                            mode="contained" 
                            icon="pencil" 
                            onPress={() => nav.navigate("JobForm", { jobData: job })}
                        />
                    ) : (
                        <ApplyJobButton 
                            jobId={jobId} 
                            isApplied={isApplied} 
                            isExpired={job.is_expired}
                            onApplySuccess={() => setIsApplied(true)} 
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default JobDetail;