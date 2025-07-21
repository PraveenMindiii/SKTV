import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import useTranslate from "../hooks/useTranslate";

interface SessionModalProp {
  handleCallBack: () => void;
}

export const SessionModal: React.FC<SessionModalProp> = ({ handleCallBack }) => {
  const { t } = useTranslate();
  const appTheme = useSelector((state: any) => state.appthemes);
  return (
    <View>
      <Modal animationType="none" transparent={true} visible={true} statusBarTranslucent={true}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal:20
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: 20,
              paddingHorizontal: 30,
              paddingVertical: 20,
            }}
          >
            <Image
              source={require("../assets/images/logout.png")}
              style={{
                height: 70,
                width: 70,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
            <View style={{ marginVertical: 20, paddingHorizontal: 15 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#626262",
                  fontFamily: "Poppins-Medium",
                  textAlign: "center",
                }}
              >
                {t('session_expire')}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={handleCallBack}
                style={{
                  height: 40,
                  backgroundColor: appTheme?.themeColor,
                  width: "46%",
                  borderRadius: 9,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    includeFontPadding: false,
                  }}
                >
                  {t("Logout")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
