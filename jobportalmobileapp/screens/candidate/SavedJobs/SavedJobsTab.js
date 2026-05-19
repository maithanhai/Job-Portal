import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Alert, RefreshControl } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { authApis, endpoints } from "../../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../../../style/Styles";
import JobCard from "../../../components/candidate/JobCard";
import Colors from "../../../theme/Color";

const SavedJobsTab = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const nav = useNavigation();
    const isFocused = useIsFocused();

    // Giữ nguyên 2 biến giống hệt HomeTab để kiểm soát chặn 404
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // 1. Hàm tải danh sách (Y chang logic HomeTab)
    const loadSavedJobs = async (targetPage, isLoadMore = false) => {
        try {
            if (isLoadMore) setLoadingMore(true);
            else setLoading(true);

            let token = await AsyncStorage.getItem("token");
            if (!token) return;

            // Xử lý chuỗi endpoint sạch để tránh lỗi mất param page
            let baseEndpoint = endpoints['saved-jobs'];
            if (baseEndpoint.endsWith('/')) {
                baseEndpoint = baseEndpoint.slice(0, -1);
            }
            let url = `${baseEndpoint}?page=${targetPage}`;

            let res = await authApis(token).get(url);
            
            setHasNextPage(res.data.next !== null);

            if (targetPage === 1)
                setSavedJobs(res.data.results);
            else
                setSavedJobs(prev => [...prev, ...res.data.results]);
                
        } catch (ex) {
            console.error("Lỗi tải danh sách công việc đã lưu:", ex);
            if (ex.response?.status === 404) {
                setHasNextPage(false);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // 2. Kéo xuống để làm mới (Pull-to-refresh)
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1); 
        setHasNextPage(true);
        try {
            let token = await AsyncStorage.getItem("token");
            let baseEndpoint = endpoints['saved-jobs'].endsWith('/') ? endpoints['saved-jobs'].slice(0, -1) : endpoints['saved-jobs'];
            let res = await authApis(token).get(`${baseEndpoint}?page=1`);
            
            setSavedJobs(res.data.results);
            setHasNextPage(res.data.next !== null);
        } catch (ex) {
            console.error("Lỗi khi refresh:", ex);
        } finally {
            setRefreshing(false);
        }
    };

    // 3. Gọi API khi page thay đổi hoặc khi tab được focus vào
    useEffect(() => {
        if (isFocused) {
            loadSavedJobs(page, page > 1);
        }
    }, [page, isFocused]);

    // 4. Reset khi đổi trạng thái màn hình (đảm bảo luôn vào trang 1)
    useEffect(() => {
        if (isFocused) {
            setPage(1);
            setHasNextPage(true);
        }
    }, [isFocused]);

    // 5. Xử lý khi cuộn đến cuối danh sách (Load more)
    const loadMore = () => {
        if (hasNextPage && !loading && !loadingMore) {
            setPage(prev => prev + 1);
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

    return (
        <View style={[Styles.container, Styles.padding, { backgroundColor: "#f8f9fa" }]}>
            <FlatList
                onEndReached={loadMore}
                onEndReachedThreshold={0.2}
                data={savedJobs}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={(loading || loadingMore) && <ActivityIndicator color={Colors.primary} />}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={{ alignItems: "center", marginTop: 80, paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#555" }}>
                                Bạn chưa lưu công việc nào.
                            </Text>
                            <Text style={{ color: "gray", fontSize: 13, marginTop: 5 }}>
                                Bấm thả tim ở trang chủ để lưu lại các công việc yêu thích.
                            </Text>
                        </View>
                    )
                }
                renderItem={({ item }) => {
                    const embeddedJob = {
                        ...item.job_details,
                        is_saved: true 
                    };

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