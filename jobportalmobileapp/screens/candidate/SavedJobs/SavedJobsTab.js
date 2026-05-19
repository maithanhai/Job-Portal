import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Alert, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { authApis, endpoints } from "../../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalStyles from "../../../style/Styles";
import ScreenStyles from "./Styles";
import JobCard from "../../../components/candidate/JobCard";
import Colors from "../../../theme/Color";

const SavedJobsTab = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Thêm các state phục vụ phân trang
    const [page, setPage] = useState(1);
    const [nextUrl, setNextUrl] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const nav = useNavigation();
    const isFocused = useIsFocused();

    const loadSavedJobs = async (currentPage, isLoadMore = false) => {
        try {
            let token = await AsyncStorage.getItem("token");
            if (!token) {
                setLoading(false);
                setRefreshing(false);
                setLoadingMore(false);
                return;
            }

            // Gắn thêm params page vào endpoint. 
            // Nếu endpoint đã có sẵn query dạng ?abc=xyz thì dùng &page=, ngược lại dùng ?page=
            const urlSeparator = endpoints['saved-jobs'].includes('?') ? '&' : '?';
            const requestUrl = `${endpoints['saved-jobs']}${urlSeparator}page=${currentPage}`;

            let res = await authApis(token).get(requestUrl);
            
            // Nhận diện cấu trúc trả về: Có phân trang (res.data.results) hoặc Không phân trang (res.data)
            const hasPagination = res.data.results !== undefined;
            const newData = hasPagination ? res.data.results : res.data;
            
            setNextUrl(hasPagination ? res.data.next : null);

            if (isLoadMore) {
                // Nếu là load more thì nối mảng dữ liệu mới vào mảng cũ
                setSavedJobs(prev => [...prev, ...newData]);
            } else {
                // Nếu là load lần đầu hoặc refresh thì đè mảng mới luôn
                setSavedJobs(newData);
            }
        } catch (ex) {
            console.error("Lỗi tải danh sách công việc đã lưu:", ex);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    // Tự động reload trang đầu tiên khi user tab vào màn hình này
    useEffect(() => {
        if (isFocused) {
            setPage(1);
            loadSavedJobs(1, false);
        }
    }, [isFocused]);

    // Hàm xử lý kéo lên làm mới (Pull to Refresh)
    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadSavedJobs(1, false);
    };

    // Hàm xử lý khi cuộn đến đáy trang (Infinite Scroll)
    const handleLoadMore = () => {
        if (nextUrl && !loadingMore && !loading) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            loadSavedJobs(nextPage, true);
        }
    };

    const handleUnsave = async (jobId) => {
        try {
            let token = await AsyncStorage.getItem("token");
            let res = await authApis(token).delete(endpoints['saved-job-delete'](jobId));

            if (res.status === 204 || res.status === 200) {
                setSavedJobs(prev => prev.filter(item => item.job !== jobId));
            }
        } catch (ex) {
            console.error("Lỗi khi hủy lưu công việc:", ex);
            Alert.alert("Lỗi", "Không thể thực hiện thao tác này.");
        }
    };

    // Hiển thị vòng xoay loading nhỏ ở dưới đáy danh sách khi đang load trang tiếp theo
    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        );
    };

    if (loading && page === 1) {
        return (
            <View style={[GlobalStyles.container, ScreenStyles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={[GlobalStyles.container, GlobalStyles.padding, { backgroundColor: "#f8f9fa" }]}>
            <FlatList
                data={savedJobs}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
                // Các thuộc tính kích hoạt phân trang khi cuộn đáy
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2} // Còn cách đáy 20% chiều cao màn hình thì kích hoạt load tiếp
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    <View style={ScreenStyles.emptyContainer}>
                        <Text style={ScreenStyles.emptyText}>Bạn chưa lưu công việc nào.</Text>
                        <Text style={ScreenStyles.emptySubText}>
                            Bấm thả tim ở trang chủ để lưu lại các công việc yêu thích.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    // job_details đã có is_saved: true từ backend, không cần thêm lại
                    const embeddedJob = item.job_details;

                    return (
                        <JobCard
                            item={embeddedJob}
                            next={() => nav.navigate('JobDetail', { jobId: item.job })}
                            onToggleSave={() => handleUnsave(item.job)}
                        />
                    );
                }}
            />
        </View>
    );
};

export default SavedJobsTab;