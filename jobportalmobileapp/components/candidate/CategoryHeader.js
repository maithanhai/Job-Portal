import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../../configs/Apis";
import { Chip } from "react-native-paper";
import Styles from "../../style/Styles";
import Colors from "../../theme/Color";

const CategoryHeader = ({ cateId, setCateId }) => {
    const [categories, setCategories] = useState([]);

    const loadCategories = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <View style={{ marginBottom: 15 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={() => setCateId(null)} style={Styles.margin}>
                    <Chip 
                        mode={cateId === null ? "flat" : "outlined"} 
                        icon="label"
                        style={{ backgroundColor: cateId === null ? Colors.primary : "white" }}
                        textStyle={{ color: cateId === null ? "white" : "black" }}
                    >
                        Tất cả
                    </Chip>
                </TouchableOpacity>

                {categories.map(c => (
                    <TouchableOpacity onPress={() => setCateId(c.id)} style={Styles.margin} key={`c${c.id}`}>
                        <Chip 
                            mode={cateId === c.id ? "flat" : "outlined"} 
                            icon="label"
                            style={{ backgroundColor: cateId === c.id ? Colors.primary : "white" }}
                            textStyle={{ color: cateId === c.id ? "white" : "black" }}
                        >
                            {c.name}
                        </Chip>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

export default CategoryHeader;