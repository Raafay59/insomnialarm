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
import React, { useEffect, useState } from "react";

export default function App() {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [amPm, setAmPm] = useState('AM');
  const [alarmStatus, setAlarmStatus] = useState(false);
  const [isSettingAlarm, setIsSettingAlarm] = useState(false);
  function formatMinutes() {
    if (minute < 10) {
      return `0${minute}`;
    }
    return minute;
  }
  return (
    <View style={styles.container}>
      <View id="current alarm txt" style={styles.header}>
        <Text style={{ fontSize: 50, textAlign: "center", color: "#fff" }}>
          Current Alarm:
        </Text>
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
            setAlarmStatus(value);
          }}
        ></Switch>
      </View>
      <View id="change alarm" style={styles.changeAlarm}>
        <Button title="Change Alarm" onPress={() => setIsSettingAlarm(true)} />
      </View>
      <View id="view mosaic" style={styles.viewMosaic}>
        <Button title="View Mosaic" />
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
                <Picker.Item label="00" value={0} color="white" />
                <Picker.Item label="15" value={15} color="white" />
                <Picker.Item label="30" value={30} color="white" />
                <Picker.Item label="45" value={45} color="white" />
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
            <Button title="save" onPress={() => setIsSettingAlarm(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3f0491",
    justifyContent: "center",
    padding: 50,
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
