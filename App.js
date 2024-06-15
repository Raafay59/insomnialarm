import { StatusBar } from "expo-status-bar";
import {
  Button,
  Modal,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
import DrawingScreen from "./DrawingScreen.js";
import DrawingSuccessContext from "./DrawingSuccessContext.js";

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [amPm, setAmPm] = useState("AM");
  //used for the switch
  const [alarmStatus, setAlarmStatus] = useState(false);
  //used for the modal
  const [isSettingAlarm, setIsSettingAlarm] = useState(false);
  //used for the alarm going off
  const [alarmIsGoingOff, setAlarmIsGoingOff] = useState(false);
  const storeAlarmTime = async () => {
    try {
      await AsyncStorage.setItem(
        "alarmTime",
        JSON.stringify({ hour, minute, amPm })
      ).then(() => console.log(`Alarm time stored: ${hour}:${minute} ${amPm}`));
    } catch (e) {
      console.log(e);
    }
  };
  const getAlarmTime = async () => {
    try {
      const value = await AsyncStorage.getItem("alarmTime");
      if (value !== null) {
        const { hour, minute, amPm } = JSON.parse(value);
        setHour(hour);
        setMinute(minute);
        setAmPm(amPm);
        console.log(`Alarm time retrieved: ${hour}:${minute} ${amPm}`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  function formatMinutes() {
    if (minute < 10) {
      return `0${minute}`;
    }
    return minute;
  }
  function timeUntil(hrs, mins, period) {
    //write a function that returns the seconds between now and the time passed in
    const now = new Date();
    const alarm = new Date();
    alarm.setHours(hrs);
    alarm.setMinutes(mins);
    alarm.setSeconds(0);
    alarm.setMilliseconds(0);
    if (period === "PM") {
      alarm.setHours(alarm.getHours() + 12);
    }
    let time = alarm - now;
    if (time < 0) {
      time += 86400000;
    }
    console.log(time / 1000);
    return time / 1000;
  }
  async function setNotificatiiion() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ALARM",
        body: "WAKE UP!!!!",
        sound: "alarm.wav",
      },
      trigger: {
        seconds: timeUntil(hour, minute, amPm),
      },
    });
    console.log(`Notification scheduled for ${hour}:${minute} ${amPm}`);
  }

  useEffect(() => {
    getAlarmTime();
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("No notification permissions!");
      }
    }

    requestPermissions();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        setIsDrawing(true);
        setAlarmIsGoingOff(true);
        console.log("alarm is going off");
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    <DrawingSuccessContext.Provider value={[alarmIsGoingOff, setAlarmIsGoingOff]}>
      <View style={styles.container}>
        <View id="current alarm txt" style={styles.header}>
          <Text style={{ fontSize: 50, textAlign: "center", color: "#fff" }}>
            Current Alarm:
          </Text>
          <Button
            title="clear everything"
            onPress={() => {
              AsyncStorage.clear();
              setHour(7);
              setMinute(0);
              setAmPm("AM");
              Notifications.cancelAllScheduledNotificationsAsync();
            }}
          />
          <Button
            title="test alarm screen"
            onPress={() => {
              setIsDrawing(true);
              setAlarmIsGoingOff(true);
            }}
          />
        </View>
        <View id="time display" style={styles.timeDisplay}>
          <Text style={{ fontSize: 100, textAlign: "center", color: "#fff" }}>
            {hour}:{formatMinutes(minute)} {amPm}
          </Text>
        </View>
        <View id="alarm toggle" style={styles.alarmToggle}>
          <Text style={{ padding: 10, fontSize: 20, color: "#fff" }}>
            Alarm toggle:
          </Text>
          <Switch
            trackColor={{ false: "#6c93a3", true: "#03b6fc" }}
            ios_backgroundColor={"grey"}
            value={alarmStatus}
            onValueChange={(value) => {
              //if the alarm is being turned on and the time is set then schedule the notification
              if (value && hour !== null && minute !== null && amPm !== null) {
                setNotificatiiion();
              } else {
                Notifications.cancelAllScheduledNotificationsAsync();
              }
              setAlarmStatus(value);
            }}
          ></Switch>
        </View>
        <View id="change alarm" style={styles.changeAlarm}>
          <Button
            title="Change Alarm"
            onPress={() => setIsSettingAlarm(true)}
          />
        </View>
        <View id="view mosaic" style={styles.viewMosaic}>
          <Button
            title="View Mosaic"
            onPress={async () => {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Test",
                  body: "Notification test",
                  sound: "alarm.wav",
                },
                trigger: {
                  seconds: 2,
                },
              }).then(console.log(`Notification scheduled\n ${new Date()}`));
            }}
          />
        </View>
        <Modal
          visible={isSettingAlarm}
          onRequestClose={() => setIsSettingAlarm(false)}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.popUp}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={hour}
                  onValueChange={(itemValue, itemIndex) => setHour(itemValue)}
                  style={{ flex: 1 }}
                >
                  <Picker.Item label="1" value={1} color="white" />
                  <Picker.Item label="2" value={2} color="white" />
                  <Picker.Item label="3" value={3} color="white" />
                  <Picker.Item label="4" value={4} color="white" />
                  <Picker.Item label="5" value={5} color="white" />
                  <Picker.Item label="6" value={6} color="white" />
                  <Picker.Item label="7" value={7} color="white" />
                  <Picker.Item label="8" value={8} color="white" />
                  <Picker.Item label="9" value={9} color="white" />
                  <Picker.Item label="10" value={10} color="white" />
                  <Picker.Item label="11" value={11} color="white" />
                  <Picker.Item label="12" value={12} color="white" />
                </Picker>
                <Picker
                  selectedValue={minute}
                  onValueChange={(itemValue, itemIndex) => setMinute(itemValue)}
                  style={{ flex: 1 }}
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((value) => (
                    <Picker.Item
                      key={value}
                      label={String(value).padStart(2, "0")}
                      value={value}
                      color="white"
                    />
                  ))}
                </Picker>
                <Picker
                  selectedValue={amPm}
                  onValueChange={(itemValue, itemIndex) => setAmPm(itemValue)}
                  style={{ flex: 1 }}
                >
                  <Picker.Item label="AM" value="AM" color="white" />
                  <Picker.Item label="PM" value="PM" color="white" />
                </Picker>
              </View>
              <Button
                title="save"
                onPress={() => {
                  //if the alarm is on then schedule the notification
                  if (alarmStatus) {
                    setNotificatiiion();
                  }
                  setIsSettingAlarm(false);
                  storeAlarmTime();
                }}
              />
            </View>
          </View>
        </Modal>
        <Modal
          visible={alarmIsGoingOff}
          onRequestClose={() => setIsSettingAlarm(false)}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.alarmPopUp}>
              <Text
                style={{
                  color: "white",
                  fontSize: 40,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                ALARM IS GOING OFF
              </Text>
              {isDrawing && (
                <View style={styles.canvas}>
                  <DrawingScreen />
                </View>
              )}
              <Button
                title="stop alarm"
                onPress={() => {
                  setAlarmIsGoingOff(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </DrawingSuccessContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d126b",
    justifyContent: "center",
    padding: 50,
  },
  canvas: {
    flex: 1,
    backgroundColor: "tomato",
    borderRadius: 30,
    margin: 20,
  },
  header: {
    // backgroundColor: "tomato",
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  timeDisplay: {
    // backgroundColor: "dodgerblue",
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  alarmToggle: {
    // backgroundColor: "gold",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  changeAlarm: {
    // backgroundColor: "purple",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewMosaic: {
    // backgroundColor: "green",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popUp: {
    height: 300,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "midnightblue",
    borderRadius: 30,
    alignItems: "stretch",
    paddingBottom: 20,
  },
  alarmPopUp: {
    height: 700,
    width: 350,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "midnightblue",
    borderRadius: 30,
    alignItems: "stretch",
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add this line
  },
  pickerContainer: {
    // backgroundColor: "white",
    padding: 10,
    flex: 1,
    flexDirection: "row",
  },
});
