import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, RefreshControl, StyleSheet, Alert } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { authApis, endpoints } from "../../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../../../style/Styles";
import Colors from "../../../theme/Color";
import ApplicationCard from "../../../components/candidate/ApplicationCard";

const ApplicationsTab = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Thêm các state phân trang ứng tuyển
    const [page, setPage] = useState(1);
    const [nextUrl, setNextUrl] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const isFocused = useIsFocused();
    const nav = useNavigation();

    const loadApplications = async (currentPage, isLoadMore = false) => {
        try {
            let token = await AsyncStorage.getItem("token");
            if (!token) {
                setLoading(false);
                setRefreshing(false);
                setLoadingMore(false);
                return;
            }

            const urlSeparator = endpoints['applications'].includes('?') ? '&' : '?';
            const requestUrl = `${endpoints['applications']}${urlSeparator}page=${currentPage}`;

            let res = await authApis(token).get(requestUrl);
            
            const hasPagination = res.data.results !== undefined;
            const newData = hasPagination ? res.data.results : res.data;
            
            setNextUrl(hasPagination ? res.data.next : null);

            if (isLoadMore) {
                setApplications(prev => [...prev, ...newData]);
            } else {
                setApplications(newData);
            }
        } catch (ex) {
            console.error("Lỗi lấy danh sách ứng tuyển:", ex);
            Alert.alert("Lỗi", "Không thể lấy lịch sử ứng tuyển.");
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            setPage(1);
            loadApplications(1, false);
        }
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadApplications(1, false);
    };

    const handleLoadMore = () => {
        if (nextUrl && !loadingMore && !loading) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            loadApplications(nextPage, true);
        }
    };

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
            <View style={[Styles.container, localStyles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={[Styles.container, Styles.padding, { backgroundColor: "#f8f9fa" }]}>
            <FlatList
                data={applications}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={
                    <View style={localStyles.emptyContainer}>
                        <Text style={localStyles.emptyText}>Bạn chưa ứng tuyển công việc nào.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ApplicationCard 
                        item={item} 
                        onJobPress={() => item.job && nav.navigate('JobDetail', { jobId: item.job })} 
                    />
                )}
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    centered: { justifyContent: "center", alignItems: "center" },
    emptyContainer: { alignItems: "center", marginTop: 80, paddingHorizontal: 20 },
    emptyText: { fontSize: 16, fontWeight: "bold", color: "#555" }
});

export default ApplicationsTab;