import React, { Component } from 'react';
import { Linking } from 'react-native';
import _ from "lodash";
import NavigationService from "../../navigator/NavigationService";

const parseUrl = (url) => {
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match
    while ((match = regex.exec(url))) {
        params[match[1]] = match[2]
    }
    return params
}

export default function ShareLinking(WrappedComponent) {

    return class AppUpdate extends Component {
        componentDidMount() {
            Linking.addListener('url', this._handleOpenURL)
        }

        componentWillUnmount () {
            Linking.removeEventListener('url', this._handleOpenURL);
        }

        _handleOpenURL(urlInfo) {
            const params = parseUrl(urlInfo.url)
            const target = _.get(params, "target", "/")
            if (target === "/") {
            } else if (target === "square") {
                NavigationService.navigate("SquareHome", {});
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
