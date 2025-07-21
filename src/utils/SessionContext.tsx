// SessionContext.tsx
import React, { useEffect, useState } from "react";
import { SessionModal } from "../components/SessionModal";
import { setTrigger } from "./SessionModalController";
import { useDispatch } from "react-redux";
import { logout } from "../contexts/AuthSlice";
import { updateAppTheme } from "../contexts/AppThemesSlice";

export const SessionProvider = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     setTrigger(() => () => setVisible(true));
//   }, []);
  useEffect(() => {
    setTrigger(() => {
      console.log('Session modal trigger called');
      setVisible(true);
    });
  }, []);

  return (
    <>
      {visible && (
        <SessionModal
          handleCallBack={() => {
            dispatch(logout());
             dispatch(
                  updateAppTheme({
                    themeName: 'Default Theme',
                    themeSubName: 'Tesla',
                    themeColor: '#42A3A3',
                    // themeBackgroundColor:string,
                    themeGradientColorOne: 'rgba(73, 218, 218, 1)',
                    themeGadientColorSecond: 'rgba(66, 163, 163, 1)',
                  }),
                );
            setVisible(false);
          }}
        />
      )}
    </>
  );
};
