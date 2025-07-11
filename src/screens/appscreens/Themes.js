import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { getThemeMode } from "../../contexts/ThemeSlice";
import useTranslate from "../../hooks/useTranslate";
// import { useSelector } from "react-redux";
// import { getSafeAreaMode } from "../../contexts/SafeAreaSlice";
// import { Colors } from "react-native/Libraries/NewAppScreen";


const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
// Theme list
const themeList = [
  {
    id: 0,
    themeColor: "Default Theme",
    themeVarient: "Tesla",
    appliedTheme: true,
    images: [
      require("../../assets/images/themes/img_theme_tesla0.png"),
      require("../../assets/images/themes/img_theme_tesla1.png"),
      require("../../assets/images/themes/img_theme_tesla2.png"),
    ],
  },
  {
    id: 1,
    themeColor: "Purple Theme",
    themeVarient: "Vogue",
    appliedTheme: false,
    images: [
      require("../../assets/images/themes/img_theme_vogue0.png"),
      require("../../assets/images/themes/img_theme_vogue1.png"),
      require("../../assets/images/themes/img_theme_vogue2.png"),
    ],
  },
  {
    id: 2,
    themeColor: "Black",
    themeVarient: "Power",
    appliedTheme: false,
    images: [
      require("../../assets/images/themes/img_theme_power0.png"),
      require("../../assets/images/themes/img_theme_power1.png"),
      require("../../assets/images/themes/img_theme_power2.png"),
    ],
  },
  {
    id: 3,
    themeColor: "Military",
    themeVarient: "Defender",
    appliedTheme: false,
    images: [
      require("../../assets/images/themes/img_theme_defender0.png"),
      require("../../assets/images/themes/img_theme_defender1.png"),
      require("../../assets/images/themes/img_theme_defender2.png"),
    ],
  },
  {
    id: 4,
    themeColor: "Latin America",
    themeVarient: "Festival",
    appliedTheme: false,
    images: [
      require("../../assets/images/themes/img_theme_festival0.png"),
      require("../../assets/images/themes/img_theme_festival1.png"),
      require("../../assets/images/themes/img_theme_festival2.png"),
    ],
  },
];

const AppThemes = ({ navigation }) => {
  const { t } = useTranslate();
  // const insets = useSelector(getSafeAreaMode);
  const currentDarkMode = "dark";
  const [selectedIndex, setSelectedIndex] = useState();
  const [appliedTheme, setAppliedTheme] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleShowImage = (img) => {
    setIsModalVisible(true);
    setShowImage(img);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Modal */}
      {selectedIndex >= 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            zIndex: 20,
            width: "100%",
            borderWidth: 0.5,
          }}
        >
          <View
            style={[
              styles.bottomView,
              {
                backgroundColor: "#000000",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                setAppliedTheme(selectedIndex);
                setSelectedIndex(-1);
              }}
            >
              <Text
                style={{
                  color: "#000000",
                  fontFamily: "Poppins-Bold",
                  fontSize: 15,
                }}
              >
                {t("Apply_theme") || "Apply Theme"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal visible={isModalVisible} transparent statusBarTranslucent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={showImage}
            style={{
              width: screenWidth * 0.9,
              height:screenHeight*0.85,
              aspectRatio: 0.55,
              // resizeMode: "stretch",
              borderRadius:30
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(false);
            }}
            style={{ marginTop:25 }}
          >
            <Image style={{height:40, width:40, resizeMode:"contain"}} source={require("../../assets/images/cancle_icon.png")} />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Main container */}
      <View
        style={{
          flex: 1,
          paddingBottom: 50,
          marginTop: 0,
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 15,
        }}
      >
        {/* Status bar */}
        <StatusBar
          backgroundColor="#FFFFFF"
          translucent={true}
          barStyle="dark-content"
        />

        {/* Top back button and heading */}
        <CommonHeader
          title={t("themes")}
          onLeftPress={() => {
            navigation?.goBack();
          }}
        />

          {/* <HeadersAppScreen TitleName={t('THEMES')} onPress={handleGoBack} /> */}

        {/* Flat list for all themes */}
        <FlatList
          data={themeList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 15, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => (
            <CommonView
              themeColor={item.themeColor}
              themeVarient={item.themeVarient}
              appliedTheme={appliedTheme === item.id}
              isChecked={selectedIndex === item.id}
              currentDarkMode={currentDarkMode}
              language={t}
              images={item.images}
              showImage={handleShowImage}
              onSelect={() => {
                if (selectedIndex === item.id) {
                  setSelectedIndex(-1);
                } else {
                  setSelectedIndex(item.id);
                }
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

export default AppThemes;

const CommonView = ({
  themeColor,
  themeVarient,
  appliedTheme,
  isChecked,
  onSelect,
  showImage,
  language,
  images,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#000000",
            fontSize: 15,
            fontFamily: "Poppins-Bold",
            fontWeight: "500",
          }}
        >
          {themeColor}
          <Text
            style={{
              color: "#626262",
              fontSize: 15,
              fontFamily: "Poppins-Medium",
              fontWeight: "500",
            }}
          >
            {" - "}({themeVarient})
          </Text>
        </Text>
        {appliedTheme ? (
          <Text
            style={{
              color: "#06841C",
              fontSize: 15,
              fontFamily: "Poppins-Bold",
              fontWeight: "500",
            }}
          >
            {language("APPLIED")}
          </Text>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={onSelect}
            style={{
              height: 23,
              width: 23,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={
                isChecked
                  ? require("../../assets/images/active_circle_icon.png")
                  : require("../../assets/images/inactive_circle_icon.png")
              }
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={{ height: 10 }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {images?.map((img, index) => (
          <TouchableOpacity
            onPress={() => {
              console.log("the current image is ---->>>>>>", index);
              showImage(images[index]);
            }}
            style={{
              width: "31%",
              aspectRatio: 2 / 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              key={index}
              source={img}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    paddingHorizontal: 20,
    paddingVertical: 35,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
  },
  applyButton: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
