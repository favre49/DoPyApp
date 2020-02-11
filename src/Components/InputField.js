import React, { Component } from "react";
import colors from "../Styles/Color";
import {
  View,
  Text,
  StyleSheet,
  TextInput
} from "react-native";

class InputField extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {text: ''};
    }

    render() {
        const {
              labelText,
              inputType,
              writeText,
              onChangeText,
              onSubmitEditing
        } = this.props;

        const keyboardType = inputType == "idno" ? "number-pad": "default";

        return (
            <View style={styles.wrapper}>
                <TextInput
                    value={writeText}
                    placeholder={labelText}
                    style = {styles.inputFieldStyle}
                    autoCorrect={false}
                    onChangeText={onChangeText}
                    autoCapitalize="characters"
                    keyboardType={keyboardType}
                    textColor={colors.white}
                    placeholderTextColor={colors.white}
                    onSubmitEditing={onSubmitEditing}
                 />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex'
    },
    inputFieldStyle: {
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 30,
        color: colors.white,
        borderBottomColor: colors.white
    }
});

export default InputField;