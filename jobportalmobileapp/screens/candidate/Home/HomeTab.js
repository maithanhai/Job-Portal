import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, FlatList, View, Alert, RefreshControl } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { MyUserContext } from "../../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Styles from "../../../style/Styles";
import CategoryHeader from "../../../components/candidate/CategoryHeader"; 
import JobCard from "../../../components/candidate/JobCard"; 
import Colors from "../../../theme/Color";

const HomeTab = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [cateId, setCateId] = useState(null);
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    // 1. Hàm tải danh sách công việc (có phân trang, tìm kiếm, lọc danh mục)
    const loadJobs = async () => {
        try {
            setLoading(true);
            let token = await AsyncStorage.getItem("token");
            let url = `${endpoints['jobs']}?page=${page}`;

            // Truyền chuẩn biến 'q' để khớp với cách bắt của thầy dưới Backend
            if (q) { url = `${url}&q=${q}`; }
            if (cateId) { url = `${url}&category_id=${cateId}`; }

            let res = token 
                ? await authApis(token).get(url)
                : await Apis.get(url);
            
            if (page === 1)
                setJobs(res.data.results);
            else if (page > 1)
                setJobs([...jobs, ...res.data.results]);

            if (res.data.next === null)
                setPage(0);
                
        } catch (ex) {
            console.error("Lỗi tải danh sách công việc:", ex);
        } finally {
            setTimeout(() => { setLoading(false); }, 500);
        }
    };

    // 2. Kéo xuống để làm mới (Pull-to-refresh)
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1); 
        try {
            let token = await AsyncStorage.getItem("token");
            let url = `${endpoints['jobs']}?page=1`;

            if (q) { url = `${url}&q=${q}`; }
            if (cateId) { url = `${url}&category_id=${cateId}`; }

            let res = token ? await authApis(token).get(url) : await Apis.get(url);
            
            setJobs(res.data.results);
            if (res.data.next === null) setPage(0);
        } catch (ex) {
            console.error("Lỗi khi refresh:", ex);
        } finally {
            setRefreshing(false);
        }
    };

    // 3. Xử lý lưu/hủy lưu việc làm (Tim đỏ/Tim xám)
    const handleToggleSave = async (jobId, isSavedCurrent) => {
        try {
            let token = await AsyncStorage.getItem("token");
            if (!token || !user || user.role !== "CANDIDATE") {
                Alert.alert("Thông báo", "Vui lòng đăng nhập tài khoản ứng viên để lưu việc làm!");
                return;
            }
            if (isSavedCurrent) {
                await authApis(token).delete(endpoints['saved-job-delete'](jobId));
            } else {
                await authApis(token).post(endpoints['saved-jobs'], { "job": jobId });
            }

            // Cập nhật nóng UI đổi màu tim ngay lập tức
            setJobs(prevJobs => 
                prevJobs.map(job => job.id === jobId ? { ...job, is_saved: !isSavedCurrent } : job)
            );
        } catch (ex) {
            console.error("Lỗi thả tim:", ex);
            Alert.alert("Lỗi", "Không thể thực hiện thao tác lưu lúc này.");
        }
    };

    // 4. Gọi API tự động với độ trễ (Debounce) để chống spam khi gõ tìm kiếm
    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0)
                loadJobs();
        }, 500);
        return () => clearTimeout(timer);
    }, [q, cateId, page]);

    // 5. Nếu gõ từ khóa mới hoặc đổi danh mục, reset về trang 1
    useEffect(() => {
        setPage(1);
    }, [q, cateId]);

    // 6. Xử lý khi cuộn đến cuối danh sách (Load more)
    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    };

    return (
        <View style={[Styles.container, Styles.padding]}>
            <CategoryHeader cateId={cateId} setCateId={setCateId} />
            
            <Searchbar 
                value={q} 
                onChangeText={setQ} 
                placeholder="Tìm công việc, kỹ năng..." 
                style={{ marginBottom: 15, backgroundColor: "#f0f0f0" }}
            />

            <FlatList 
                onEndReached={loadMore}
                data={jobs} 
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={loading && <ActivityIndicator />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        colors={[Colors.primary]}
                    />
                }

                ListEmptyComponent={
                    !loading && (
                        <View style={{ alignItems: "center", marginTop: 50, paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#555" }}>
                                Không tìm thấy công việc nào.
                            </Text>
                            <Text style={{ color: "gray", fontSize: 13, marginTop: 5, textAlign: "center" }}>
                                Thử thay đổi từ khóa tìm kiếm hoặc chọn một ngành nghề khác xem sao nhé!
                            </Text>
                        </View>
                    )
                }

                renderItem={({item}) => (
                    <JobCard 
                        item={item} 
                        next={() => nav.navigate('JobDetail', { jobId: item.id })} 
                        onToggleSave={() => handleToggleSave(item.id, item.is_saved)}
                    />
                )} 
            />
        </View>
    );
};

export default HomeTab;