import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../../configs/Apis";
import Styles from "../../../style/Styles";
import CategoryHeader from "../../../components/candidate/CategoryHeader"; // Nhớ import đúng đường dẫn
import JobCard from "../../../components/candidate/JobCard"; // Nhớ import đúng đường dẫn

const HomeTab = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const [cateId, setCateId] = useState(null);
    const nav = useNavigation();

    const loadJobs = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['jobs']}?page=${page}`;

            if (q) {
                url = `${url}&q=${q}`; 
            }

            if (cateId) {
                url = `${url}&category_id=${cateId}`;
            }

            let res = await Apis.get(url);
            
            if (page === 1)
                setJobs(res.data.results);
            else if (page > 1)
                setJobs([...jobs, ...res.data.results]);

            if (res.data.next === null)
                setPage(0);
                
        } catch (ex) {
            console.error(ex);
        } finally {
            setTimeout(() => { setLoading(false); }, 1000);
        }
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0)
                loadJobs();
        }, 500);

        return () => clearTimeout(timer);
    }, [q, cateId, page]);

    useEffect(() => {
        setPage(1);
    }, [q, cateId]);

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }

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
                renderItem={({item}) => (
                    <JobCard 
                        key={item.id} 
                        item={item} 
                        next={() => nav.navigate('JobDetail', { jobId: item.id })} 
                    />
                )} 
            />
        </View>
    );
}

export default HomeTab;