/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    NativeAppEventEmitter,
    AlertIOS
} from 'react-native';

import {LocalNotificator} from 'NativeModules';

class SwiftReactNative extends Component {
    state = {
        lastNotification: null
    };

    componentDidMount() {
        this.didReceiveLocalNotification = (notification) => {
            AlertIOS.alert(notification.userInfo.message);
            this.setState({lastNotification: null});
        };

        NativeAppEventEmitter.addListener('didReceiveLocalNotification', this.didReceiveLocalNotification);
    }

    componentWillUnmount() {
        if (this.didReceiveLocalNotification) {
            NativeAppEventEmitter.removeListener('didReceiveLocalNotification', this.didReceiveLocalNotification);
            this.didReceiveLocalNotification = null;
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Swift React Native Tuts form iKantam!
                </Text>
                {this.getButton()}
            </View>
        );
    }

    getButton() {
        if (this.state.lastNotification) {
            return this.getCancelNotificationButton();
        } else {
            return this.getGenerateNotificationButton();
        }
    }

    getCancelNotificationButton() {
        return (
            <TouchableOpacity onPress={() => this.cancelNotification()} style={[styles.button, styles.errorButton]}>
                <Text>Cancel Notification</Text>
            </TouchableOpacity>
        );
    }

    getGenerateNotificationButton() {
        return (
            <TouchableOpacity onPress={() => this.generateNotification()} style={styles.button}>
                <Text>Generate New Notification</Text>
            </TouchableOpacity>
        );
    }

    generateNotification() {
        let date = new Date;

        LocalNotificator.scheduleLocalNotification({
            alertBody: 'The body',
            fireDate: date.getTime() + 1000 * 10,
            alertAction: 'View',
            alertTitle: 'The title',
            userInfo: {
                UUID: this.lastNotification,
                message: 'Created at: ' + date.toString()
            }
        }, (notificationData) => {
            this.setState({lastNotification: notificationData});
        });
    }

    cancelNotification() {
        LocalNotificator.cancelLocalNotification(this.state.lastNotification.userInfo.UUID);
        this.setState({lastNotification: null});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    button: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#AEFFB3',
        height: 40,
        width: 300,
        alignItems: 'center'
    },
    errorButton: {
        backgroundColor: '#FF8E8E'
    }
});

// request permissions
LocalNotificator.requestPermissions();

AppRegistry.registerComponent('SwiftReactNative', () => SwiftReactNative);
