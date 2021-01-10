import React from "react";
import { Text, View, TextInput } from "react-native";
import SettingsEdit from "./SettingsEdit";

import { DialogComponent, ScaleAnimation } from "react-native-dialog-component";

export default function Settings() {
  return (
    <View>
      <DialogComponent
        ref={(component) => {
          dialogComponent = component;
        }}
        dialogAnimation={new ScaleAnimation()}
      >
        <View
          style={{
            justifyContent: "space-between",
            flex: 1,
            marginLeft: 4,
            marginRight: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            editable
            underlineColorAndroid="blue"
            textAlign="center"
            keyboardType="numeric"
            maxLength={2}
            style={{ width: 40 }}
          />
          <Text>:</Text>
          <TextInput
            editable
            maxLength={2}
            underlineColorAndroid="blue"
            textAlign="center"
            keyboardType="numeric"
            style={{ width: 40 }}
          />
        </View>
      </DialogComponent>
      <SettingsEdit
        title="Username"
        valuePlaceholder="..."
        onPress={() => {
          dialogComponent.show();
        }}
        value="john"
      />
    </View>
  );
}
