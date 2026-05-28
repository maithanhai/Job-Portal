import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, RefreshControl, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { authApis, endpoints } from '../../../configs/Apis';
import Colors from '../../../theme/Color';
import VerifyWrapper from '../../../components/employer/VerifyWrapper';
import { MyUserContext } from '../../../configs/Contexts';
import MetricItem from '../../../components/employer/MetricItem'; 
import PipelineItem from '../../../components/employer/PipelineItem';
import LocalStyles from './Styles';

const screenWidth = Dimensions.get("window").width;

const HomeEmployerTab = ({ navigation }) => {
    const [user] = useContext(MyUserContext);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();

    const [stats, setStats] = useState({
        kpis: { total_jobs: 0, total_applications: 0, acceptance_rate: 0 },
        pipeline: { pending: 0, reviewing: 0, accepted: 0, rejected: 0 },
        chart_data: []
    });

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        if (user?.role === 'EMPLOYER' && user?.is_verified !== true) {
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(endpoints['dashboard-stats']);
            if (res.data) setStats(res.data);
        } catch (ex) {
            Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isFocused) loadData();
    }, [isFocused]);

    const chartData = stats?.chart_data || [];
    const labels = chartData.length > 0 ? chartData.map(d => `T${parseInt(d.label.split('/')[0], 10)}`) : ["-"];
    const dataValues = chartData.length > 0 ? chartData.map(d => d.value) : [0];
    const currentYear = new Date().getFullYear();

    return (
        <SafeAreaView style={LocalStyles.safeArea} edges={['top']}>
            <VerifyWrapper>
                <View style={LocalStyles.headerContainer}>
                    <View>
                        <Text style={LocalStyles.headerTitle}>Tổng Quan</Text>
                    </View>
                </View>

                <ScrollView 
                    contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} colors={[Colors.primary]} />}
                    showsVerticalScrollIndicator={false}
                >
                    {loading && !refreshing ? (
                        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
                    ) : (
                        <>
                            <Text style={LocalStyles.sectionTitle}>Thống kê tin tuyển dụng</Text>
                            <Card style={LocalStyles.cardContainer} elevation={1}>
                                <View style={LocalStyles.row}>
                                    <MetricItem value={stats.kpis.total_jobs} label="Tin đăng" icon="briefcase" color={Colors.primary} />
                                    <View style={LocalStyles.divider} />
                                    <MetricItem value={stats.kpis.total_applications} label="Hồ sơ" icon="file-document-outline" color="#3b82f6" />
                                    <View style={LocalStyles.divider} />
                                    <MetricItem value={`${stats.kpis.acceptance_rate}%`} label="Tỉ lệ nhận" icon="star-outline" color={Colors.status.accepted} />
                                </View>
                            </Card>

                            <Text style={[LocalStyles.sectionTitle, { marginTop: 24 }]}>Hồ sơ ứng tuyển</Text>
                            <Card style={LocalStyles.cardContainer} elevation={1}>
                                <View style={LocalStyles.row}>
                                    <PipelineItem value={stats.pipeline.pending} label="Chờ duyệt" color={Colors.status.pending} />
                                    <PipelineItem value={stats.pipeline.reviewing} label="Đang xem" color={Colors.status.reviewing} />
                                    <PipelineItem value={stats.pipeline.accepted} label="Đã nhận" color={Colors.status.accepted} />
                                    <PipelineItem value={stats.pipeline.rejected} label="Từ chối" color={Colors.status.rejected} />
                                </View>
                            </Card>

                            <Text style={[LocalStyles.sectionTitle, { marginTop: 24 }]}>Hiệu quả tuyển dụng năm {currentYear}</Text>
                            <Card style={[LocalStyles.cardContainer, { padding: 0, overflow: 'hidden' }]} elevation={1}>
                                <View style={{ paddingTop: 20, alignItems: 'center' }}>
                                    <BarChart
                                        data={{
                                            labels: labels,
                                            datasets: [{ data: dataValues }]
                                        }}
                                        width={screenWidth - 32}
                                        height={260}
                                        yAxisLabel=""
                                        fromZero={true}
                                        showValuesOnTopOfBars={false} 
                                        segments={4} 
                                        chartConfig={{
                                            backgroundColor:Colors.white,
                                            backgroundGradientFrom: Colors.white,
                                            backgroundGradientTo: Colors.white,
                                            decimalPlaces: 0,
                                            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, 
                                            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`, 
                                            barPercentage: 0.45,
                                            fillShadowGradientOpacity: 1,
                                            fillShadowGradient: Colors.primary, 
                                            propsForBackgroundLines: {
                                                strokeWidth: 1,
                                                stroke: Colors.lightGray,
                                                strokeDasharray: "4",
                                            },
                                            propsForLabels: {
                                                fontSize: 10,
                                            }
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 8,
                                            paddingRight: 20,
                                        }}
                                    />
                                </View>
                            </Card>
                        </>
                    )}
                </ScrollView>
            </VerifyWrapper>
        </SafeAreaView>
    );
};

export default HomeEmployerTab;