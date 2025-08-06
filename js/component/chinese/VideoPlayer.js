import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  TouchableHighlight,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Animated,
  SafeAreaView,
  Easing,
  Image,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import Video from "react-native-video";
import padStart from "lodash/padStart";
// import { Modal } from '@ant-design/react-native'
// import uriMap from "../util/url";
import { pxToDp } from "../../util/tools";
import { Modal } from "antd-mobile-rn";

// const baseURL = uriMap["aliyunOSS"];
const log = console.log.bind(console);

export default class VideoPlayer extends Component {
  static defaultProps = {
    toggleResizeModeOnFullscreen: true,
    controlAnimationTiming: 100,
    doubleTapTime: 100,
    playInBackground: false,
    playWhenInactive: false,
    resizeMode: "contain",
    isFullscreen: false,
    showOnStart: true,
    paused: false,
    repeat: false,
    muted: false,
    volume: 1,
    title: "",
    rate: 1,
    showTimeRemaining: true,
    showHours: false,
    moreToolsVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      // Video
      resizeMode: this.props.resizeMode,
      paused: this.props.paused,
      muted: this.props.muted,
      volume: this.props.volume,
      rate: this.props.rate,
      fileUrl: this.props.fileUrl,
      // Controls
      isFullscreen:
        this.props.isFullScreen || this.props.resizeMode === "cover" || false,
      showTimeRemaining: this.props.showTimeRemaining,
      showHours: this.props.showHours,
      volumeTrackWidth: 0,
      volumeFillWidth: 0,
      seekerFillWidth: 0,
      showControls: this.props.showOnStart,
      volumePosition: 0,
      seekerPosition: 0,
      volumeOffset: 0,
      seekerOffset: 0,
      seeking: false,
      originallyPaused: false,
      scrubbing: false,
      loading: false,
      currentTime: 0,
      error: false,
      duration: 0,
    };

    this.opts = {
      playWhenInactive: this.props.playWhenInactive,
      playInBackground: this.props.playInBackground,
      repeat: this.props.repeat,
      title: this.props.title,
    };

    this.events = {
      onError: this.props.onError || this._onError.bind(this),
      onBack: this.props.onBack || this._onBack.bind(this),
      onScreenTouch: this._onScreenTouch.bind(this),
      onEnterFullscreen: this.props.onEnterFullscreen,
      onExitFullscreen: this.props.onExitFullscreen,
      onShowControls: this.props.onShowControls,
      onHideControls: this.props.onHideControls,
      onLoadStart: this._onLoadStart.bind(this),
      onProgress: this._onProgress.bind(this),
      onSeek: this._onSeek.bind(this),
      onLoad: this._onLoad.bind(this),
      onPause: this.props.onPause,
      onPlay: this.props.onPlay,
    };

    this.methods = {
      toggleFullscreen: this._toggleFullscreen.bind(this),
      togglePlayPause: this._togglePlayPause.bind(this),
      toggleTimer: this._toggleTimer.bind(this),
    };

    this.player = {
      controlTimeoutDelay: this.props.controlTimeout || 15000,
      volumePanResponder: PanResponder,
      seekPanResponder: PanResponder,
      controlTimeout: null,
      tapActionTimeout: null,
      volumeWidth: 150,
      iconOffset: 0,
      seekerWidth: 0,
      ref: Video,
      scrubbingTimeStep: 0,
      tapAnywhereToPause: this.props.tapAnywhereToPause,
    };

    this.animations = {
      bottomControl: {
        marginBottom: new Animated.Value(0),
        opacity: new Animated.Value(1),
      },
      topControl: {
        marginTop: new Animated.Value(0),
        opacity: new Animated.Value(1),
      },
      video: {
        opacity: new Animated.Value(1),
      },
      loader: {
        rotate: new Animated.Value(0),
        MAX_VALUE: 360,
      },
    };

    this.styles = {
      videoStyle: this.props.videoStyle || {},
      containerStyle: this.props.style || {},
    };
  }

  _onLoadStart() {
    let state = this.state;
    state.loading = true;
    this.loadAnimation();
    // this.setState(state)

    if (typeof this.props.onLoadStart === "function") {
      this.props.onLoadStart(...arguments);
    }
  }

  _onLoad(data = {}) {
    let state = this.state;
    state.duration = data.duration;
    state.loading = false;
    this.setState(state);
    if (state.showControls) {
      this.setControlTimeout();
    }

    if (typeof this.props.onLoad === "function") {
      this.props.onLoad(...arguments);
    }
  }

  _onProgress(data = {}) {
    let state = this.state;
    if (!state.scrubbing) {
      // console.log("0: currentTime: ", data.currentTime, this.state.currentTime)
      state.currentTime = data.currentTime;

      if (!state.seeking) {
        const position = this.calculateSeekerPosition();
        this.setSeekerPosition(position);
      }

      if (typeof this.props.onProgress === "function") {
        this.props.onProgress(...arguments);
      }
      this.setState(state);
    }
  }

  _onSeek(data = {}) {
    log("onSeek");
    if (this.state.scrubbing) {
      if (!state.seeking) {
        this.setControlTimeout();
        this.setState({
          scrubbing: false,
          // currentTime: data.currentTime,
          // currentTime: this.state.currentTime,
          paused: this.state.originallyPaused,
        });
      } else {
        this.setState({
          paused: false,
          scrubbing: false,
          // currentTime: data.currentTime
        });
      }
    }
  }

  onEnd = () => {
    console.log("播放完毕");
    this.setState({
      // paused: true,
      repeat: true,
    });
  };

  _onError(err) {
    console.log(err);
    let state = this.state;
    state.error = true;
    state.loading = false;

    this.setState(state);
  }

  _onScreenTouch() {
    if (this.player.tapActionTimeout) {
      clearTimeout(this.player.tapActionTimeout);
      this.player.tapActionTimeout = 0;
      this.methods.toggleFullscreen();
      const state = this.state;
      if (state.showControls) {
        this.resetControlTimeout();
      }
    } else {
      this.player.tapActionTimeout = setTimeout(() => {
        const state = this.state;
        if (this.player.tapAnywhereToPause && state.showControls) {
          this.resetControlTimeout();
        } else {
          this.toggleControls();
        }
        this.player.tapActionTimeout = 0;
      }, this.props.doubleTapTime);
    }
  }

  setControlTimeout() {
    this.player.controlTimeout = setTimeout(() => {
      this._hideControls();
    }, this.player.controlTimeoutDelay);
  }

  clearControlTimeout() {
    clearTimeout(this.player.controlTimeout);
  }

  resetControlTimeout() {
    this.clearControlTimeout();
    this.setControlTimeout();
  }

  hideControlAnimation() {
    Animated.parallel([
      Animated.timing(this.animations.topControl.opacity, {
        toValue: 0,
        duration: this.state.controlAnimationTiming,
        useNativeDriver: false,
      }),
      Animated.timing(this.animations.topControl.marginTop, {
        toValue: -100,
        duration: this.state.controlAnimationTiming,
        useNativeDriver: false,
      }),
      Animated.timing(this.animations.bottomControl.opacity, {
        toValue: 0,
        duration: this.state.controlAnimationTiming,
        useNativeDriver: false,
      }),
      Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: -100,
        duration: this.state.controlAnimationTiming,
        useNativeDriver: false,
      }),
    ]).start();
  }

  showControlAnimation() {
    Animated.parallel([
      Animated.timing(this.animations.topControl.opacity, {
        toValue: 1,
        useNativeDriver: false,
        duration: this.state.controlAnimationTiming,
      }),
      Animated.timing(this.animations.topControl.marginTop, {
        toValue: 0,
        useNativeDriver: false,
        duration: this.state.controlAnimationTiming,
      }),
      Animated.timing(this.animations.bottomControl.opacity, {
        toValue: 1,
        useNativeDriver: false,
        duration: this.state.controlAnimationTiming,
      }),
      Animated.timing(this.animations.bottomControl.marginBottom, {
        toValue: 0,
        useNativeDriver: false,
        duration: this.state.controlAnimationTiming,
      }),
    ]).start();
  }

  loadAnimation() {
    if (this.state.loading) {
      Animated.sequence([
        Animated.timing(this.animations.loader.rotate, {
          toValue: this.animations.loader.MAX_VALUE,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(this.animations.loader.rotate, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]).start(this.loadAnimation.bind(this));
    }
  }

  _hideControls() {
    if (this.mounted) {
      let state = this.state;
      state.showControls = false;
      this.hideControlAnimation();
      typeof this.events.onHideControls === "function" &&
        this.events.onHideControls();
    }
  }

  toggleControls = () => {
    let state = this.state;
    state.showControls = !state.showControls;
    if (state.showControls) {
      this.showControlAnimation();
      this.setControlTimeout();
      typeof this.events.onShowControls === "function" &&
        this.events.onShowControls();
    } else {
      this.hideControlAnimation();
      this.clearControlTimeout();
      typeof this.events.onHideControls === "function" &&
        this.events.onHideControls();
    }
  };

  _toggleFullscreen() {
    let state = this.state;

    state.isFullscreen = !state.isFullscreen;

    if (this.props.toggleResizeModeOnFullscreen) {
      state.resizeMode = state.isFullscreen === true ? "cover" : "contain";
    }

    if (state.isFullscreen) {
      typeof this.events.onEnterFullscreen === "function" &&
        this.events.onEnterFullscreen();
    } else {
      typeof this.events.onExitFullscreen === "function" &&
        this.events.onExitFullscreen();
    }

    this.setState(state);
  }

  _togglePlayPause() {
    let state = this.state;
    state.paused = !state.paused;

    if (state.paused) {
      typeof this.events.onPause === "function" && this.events.onPause();
    } else {
      typeof this.events.onPlay === "function" && this.events.onPlay();
    }

    this.setState(state);
  }

  _toggleTimer() {
    let state = this.state;
    state.showTimeRemaining = !state.showTimeRemaining;
    this.setState(state);
  }

  _onBack() {
    if (this.props.navigator && this.props.navigator.pop) {
      this.props.navigator.pop();
    } else {
      console.warn(
        "Warning: _onBack requires navigator property to function. Either modify the onBack prop or pass a navigator prop"
      );
    }
  }

  calculateTime() {
    if (this.state.showTimeRemaining) {
      const time = this.state.duration - this.state.currentTime;
      return `-${this.formatTime(time)}`;
    }
    // console.log("2: currentTime: ", this.state.currentTime)

    return this.formatTime(this.state.currentTime);
  }

  formatTime(time = 0) {
    const symbol = this.state.showRemainingTime ? "-" : "";
    time = Math.min(Math.max(time, 0), this.state.duration);

    if (!this.state.showHours) {
      const formattedMinutes = padStart(Math.floor(time / 60).toFixed(0), 2, 0);
      const formattedSeconds = padStart(Math.floor(time % 60).toFixed(0), 2, 0);

      return `${symbol}${formattedMinutes}:${formattedSeconds}`;
    }

    const formattedHours = padStart(Math.floor(time / 3600).toFixed(0), 2, 0);
    const formattedMinutes = padStart(
      (Math.floor(time / 60) % 60).toFixed(0),
      2,
      0
    );
    const formattedSeconds = padStart(Math.floor(time % 60).toFixed(0), 2, 0);

    return `${symbol}${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  setSeekerPosition(position = 0) {
    let state = this.state;
    position = this.constrainToSeekerMinMax(position);
    // console.log(`before set seek: position:${position} seekerFillWidth: ${state.seekerFillWidth}  seekerPosition: ${state.seekerPosition}`)
    state.seekerFillWidth = position;
    state.seekerPosition = position;
    // console.log(`after set seek: position:${position} seekerFillWidth: ${state.seekerFillWidth}  seekerPosition: ${state.seekerPosition}`)

    if (!state.seeking) {
      state.seekerOffset = position;
    }

    this.setState(state);
  }

  constrainToSeekerMinMax(val = 0) {
    if (val <= 0) {
      return 0;
    } else if (val >= this.player.seekerWidth) {
      return this.player.seekerWidth;
    }
    return val;
  }

  calculateSeekerPosition() {
    const percent = this.state.currentTime / this.state.duration;
    return this.player.seekerWidth * percent;
  }

  calculateTimeFromSeekerPosition() {
    const percent = this.state.seekerPosition / this.player.seekerWidth;
    return this.state.duration * percent;
  }

  seekTo(time = 0) {
    let state = this.state;
    state.currentTime = time;
    this.player.ref.seek(time);
    this.setState(state);
  }

  setVolumePosition(position = 0) {
    let state = this.state;
    position = this.constrainToVolumeMinMax(position);
    state.volumePosition = position + this.player.iconOffset;
    state.volumeFillWidth = position;

    state.volumeTrackWidth = this.player.volumeWidth - state.volumeFillWidth;

    if (state.volumeFillWidth < 0) {
      state.volumeFillWidth = 0;
    }

    if (state.volumeTrackWidth > 150) {
      state.volumeTrackWidth = 150;
    }

    this.setState(state);
  }

  constrainToVolumeMinMax(val = 0) {
    if (val <= 0) {
      return 0;
    } else if (val >= this.player.volumeWidth + 9) {
      return this.player.volumeWidth + 9;
    }
    return val;
  }

  calculateVolumeFromVolumePosition() {
    return this.state.volumePosition / this.player.volumeWidth;
  }

  calculateVolumePositionFromVolume() {
    return this.player.volumeWidth * this.state.volume;
  }

  UNSAFE_componentWillMount() {
    this.initSeekPanResponder();
    this.initVolumePanResponder();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    log("UNSAFE_componentWillReceiveProps", this.state.paused, nextProps);
    if (this.state.paused !== nextProps.paused) {
      this.setState({
        paused: nextProps.paused,
      });
    }

    if (this.styles.videoStyle !== nextProps.videoStyle) {
      this.styles.videoStyle = nextProps.videoStyle;
    }

    if (this.styles.containerStyle !== nextProps.style) {
      this.styles.containerStyle = nextProps.style;
    }
  }

  componentDidMount() {
    const position = this.calculateVolumePositionFromVolume();
    let state = this.state;
    this.setVolumePosition(position);
    state.volumeOffset = position;
    this.mounted = true;
    // console.log('视频地址', this.props.fileUrl)
    this.setState(state);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.clearControlTimeout();
  }

  initSeekPanResponder() {
    this.player.seekPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        let state = this.state;
        this.clearControlTimeout();
        const position = evt.nativeEvent.locationX;
        this.setSeekerPosition(position);
        state.seeking = true;
        state.originallyPaused = state.paused;
        state.scrubbing = false;
        if (this.player.scrubbingTimeStep > 0) {
          state.paused = true;
        }
        this.setState(state);
      },

      onPanResponderMove: (evt, gestureState) => {
        const position = this.state.seekerOffset + gestureState.dx;
        // console.log("this.state.seekerOffset: ", this.state.seekerOffset)
        // console.log("gestureState.dx: ", gestureState.dx)
        this.setSeekerPosition(position);
        let state = this.state;
        // console.log("4: currentTime: ", this.calculateTimeFromSeekerPosition())
        this.setState({
          currentTime: this.calculateTimeFromSeekerPosition(),
        });
        // this.player.ref.seek(this.calculateTimeFromSeekerPosition(), this.player.scrubbingTimeStep)
        if (
          this.player.scrubbingTimeStep > 0 &&
          !state.loading &&
          !state.scrubbing
        ) {
          const time = this.calculateTimeFromSeekerPosition();
          const timeDifference = Math.abs(state.currentTime - time) * 1000;

          if (
            time < state.duration &&
            timeDifference >= this.player.scrubbingTimeStep
          ) {
            state.scrubbing = true;

            this.setState(state);
            // this.player.ref.seek(time, this.player.scrubbingTimeStep)
            setTimeout(() => {
              // console.log("after 4: ", time)
              this.player.ref.seek(time, this.player.scrubbingTimeStep);
            }, 1);
          }
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        const time = this.calculateTimeFromSeekerPosition();
        let state = this.state;
        if (time >= state.duration && !state.loading) {
          state.paused = true;
          this.onEnd();
        } else if (state.scrubbing) {
          state.seeking = false;
        } else {
          this.seekTo(time);
          this.setControlTimeout();
          state.paused = state.originallyPaused;
          state.seeking = false;
        }
        this.setState(state);
      },
    });
  }

  initVolumePanResponder() {
    this.player.volumePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.clearControlTimeout();
      },

      onPanResponderMove: (evt, gestureState) => {
        let state = this.state;
        const position = this.state.volumeOffset + gestureState.dx;

        this.setVolumePosition(position);
        state.volume = this.calculateVolumeFromVolumePosition();

        if (state.volume <= 0) {
          state.muted = true;
        } else {
          state.muted = false;
        }

        this.setState(state);
      },

      onPanResponderRelease: (evt, gestureState) => {
        let state = this.state;
        state.volumeOffset = state.volumePosition;
        this.setControlTimeout();
        this.setState(state);
      },
    });
  }

  renderControl(children, callback, style = {}) {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        activeOpacity={0.3}
        onPress={() => {
          this.resetControlTimeout();
          callback();
        }}
        style={[styles.controls.control, style]}
      >
        {children}
      </TouchableHighlight>
    );
  }

  renderTopControls() {
    return (
      <Animated.View
        style={[
          styles.controls.top,
          {
            opacity: this.animations.topControl.opacity,
            marginTop: this.animations.topControl.marginTop,
          },
        ]}
      >
        <ImageBackground
          source={require("../../../assets/img/top-vignette.png")}
          style={[styles.controls.column]}
          imageStyle={[styles.controls.vignette]}
        >
          <SafeAreaView style={styles.controls.topControlGroup}>
            {this.renderBackControl()}
            {this.renderMoreToolsControl()}
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>
    );
  }

  renderBackControl = () => {
    const { hideVideoShow } = this.props;

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              paused: true,
              rate: 1,
              currentTime: 0.0,
            });
            hideVideoShow();
          }}
        >
          <Image
            source={require("../../../assets/img/back.png")}
            style={styles.controls.back}
          />
        </TouchableOpacity>
      </View>
    );
  };
  hideMoreToolsControl = () => {
    this.setState({
      moreToolsVisible: false,
    });
  };

  renderMoreToolsControl = () => {
    return (
      <View style={styles.player.rateControl}>
        <Text style={{ color: "white", fontSize: 20 }}>倍速 </Text>
        {this.renderRateControl(0.75)}
        {this.renderRateControl(1)}
        {this.renderRateControl(1.5)}
      </View>
    );
  };

  renderMoreTools = () => {
    return (
      <Modal
        animationType="fade"
        title="倍速播放"
        transparent
        onClose={this.hideMoreToolsControl}
        maskClosable={false}
        visible={this.state.moreToolsVisible}
        closable
        style={{ paddingVertical: 20, width: 700 }}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={styles.player.rateControl}>
          {this.renderRateControl(0.75)}
          {this.renderRateControl(1.0)}
          {this.renderRateControl(1.5)}
        </View>
      </Modal>
    );
  };

  renderVolume() {
    return (
      <View style={styles.volume.container}>
        <View
          style={[styles.volume.fill, { width: this.state.volumeFillWidth }]}
        />
        <View
          style={[styles.volume.track, { width: this.state.volumeTrackWidth }]}
        />
        <View
          style={[styles.volume.handle, { left: this.state.volumePosition }]}
          {...this.player.volumePanResponder.panHandlers}
        >
          <Image
            style={styles.volume.icon}
            source={require("../../../assets/img/newvolume.png")}
          />
        </View>
      </View>
    );
  }

  renderRateControl = (rate) => {
    const isSelected = this.state.rate === rate;
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ rate });
        }}
      >
        <Text
          style={[
            { fontSize: 25, paddingLeft: 30 },
            { fontWeight: isSelected ? "bold" : "normal" },
            { color: isSelected ? "#f17500" : "white" },
          ]}
        >
          {rate}x
        </Text>
      </TouchableOpacity>
    );
  };

  renderBottomControls() {
    return (
      <Animated.View
        style={[
          styles.controls.bottom,
          {
            opacity: this.animations.bottomControl.opacity,
            marginBottom: this.animations.bottomControl.marginBottom,
          },
        ]}
      >
        <ImageBackground
          source={require("../../../assets/img/bottom-vignette.png")}
          style={[styles.controls.column]}
          imageStyle={[styles.controls.vignette]}
        >
          {this.renderSeekbar()}
          <SafeAreaView
            style={[styles.controls.row, styles.controls.bottomControlGroup]}
          >
            {this.renderVolume()}
            {this.renderPlayPause()}
            {this.renderTimer()}
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>
    );
  }

  renderSeekbar() {
    return (
      <View
        style={styles.seekbar.container}
        collapsable={false}
        {...this.player.seekPanResponder.panHandlers}
      >
        <View
          style={styles.seekbar.track}
          onLayout={(event) =>
            (this.player.seekerWidth = event.nativeEvent.layout.width)
          }
          pointerEvents={"none"}
        >
          <View
            style={[
              styles.seekbar.fill,
              {
                width: this.state.seekerFillWidth,
                backgroundColor: "#f17500",
              },
            ]}
            pointerEvents={"none"}
          />
        </View>
        <View
          style={[styles.seekbar.handle, { left: this.state.seekerPosition }]}
          pointerEvents={"none"}
        >
          {/*<View*/}
          {/*    style={[*/}
          {/*      styles.seekbar.circle,*/}
          {/*      {backgroundColor: this.props.seekColor || '#FFF'},*/}
          {/*    ]}*/}
          {/*    pointerEvents={'none'}*/}
          {/*/>*/}
          <Image
            style={styles.seekbar.icon}
            source={require("../../../assets/img/seek_bar_circle.png")}
          />
        </View>
      </View>
    );
  }

  renderPlayPause() {
    let source =
      this.state.paused === true
        ? require("../../../assets/img/newplay.png")
        : require("../../../assets/img/newpause.png");
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            let duration = this.state.duration;
            let currentTime = this.state.currentTime;
            log("click here...", duration, currentTime);

            if (parseInt(duration) !== parseInt(currentTime)) {
              this.setState(
                {
                  paused: !this.state.paused,
                },
                () => {
                  log("=========", this.state.paused);
                }
              );
            }
          }}
        >
          <Image
            // style={[{width:pxToDp(80), height:pxToDp(80)}]}
            source={source}
            style={styles.controls.play}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderTitle() {
    if (this.opts.title) {
      return (
        <View style={[styles.controls.control, styles.controls.title]}>
          <Text
            style={[styles.controls.text, styles.controls.titleText]}
            numberOfLines={1}
          >
            {this.opts.title || ""}
          </Text>
        </View>
      );
    }

    return null;
  }

  renderTimer() {
    return this.renderControl(
      <Text style={styles.controls.timerText}>{`${this.formatTime(
        this.state.currentTime
      )} / ${this.formatTime(this.state.duration)}`}</Text>,
      this.methods.toggleTimer,
      styles.controls.timer
    );
  }

  renderLoader() {
    if (this.state.loading) {
      return (
        <View style={styles.loader.container}>
          <Animated.Image
            source={require("../../../assets/img/loader-icon.png")}
            style={[
              styles.loader.icon,
              {
                transform: [
                  {
                    rotate: this.animations.loader.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      );
    }
    return null;
  }

  renderError() {
    if (this.state.error) {
      return (
        <View style={styles.error.container}>
          <Image
            source={require("../../../assets/img/error-icon.png")}
            style={styles.error.icon}
          />
          <Text style={styles.error.text}>视频加载失败</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const baseUrl = "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/";
    const fileUrl = `${baseUrl}${this.state.fileUrl}`;
    // console.log("地址", fileUrl);
    // log("------------", this.state.paused)
    return (
      <TouchableWithoutFeedback
        onPress={this.events.onScreenTouch}
        style={[styles.player.container, this.styles.containerStyle]}
      >
        <View style={[styles.player.container, this.styles.containerStyle]}>
          <Video
            {...this.props}
            ref={(videoPlayer) => (this.player.ref = videoPlayer)}
            resizeMode={this.state.resizeMode}
            volume={this.state.volume}
            paused={this.state.paused}
            muted={this.state.muted}
            rate={this.state.rate}
            onLoadStart={this.events.onLoadStart}
            onProgress={this.events.onProgress}
            onError={this.events.onError}
            onLoad={this.events.onLoad}
            onEnd={this.onEnd}
            onSeek={this.events.onSeek}
            style={[styles.player.video, this.styles.videoStyle]}
            repeat={true}
            source={{
              uri: fileUrl,
            }}
            ignoreSilentSwitch={"ignore"}

            // source={require("../../../assets/video/study_source.mp4")}
          />
          {this.renderMoreTools()}
          {this.renderError()}
          {this.renderLoader()}
          {this.renderTopControls()}
          {this.renderBottomControls()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  player: StyleSheet.create({
    container: {
      overflow: "hidden",
      backgroundColor: "#000",
      flex: 1,
      alignSelf: "stretch",
      justifyContent: "space-between",
    },
    video: {
      overflow: "hidden",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    rateControl: {
      flexDirection: "row",
      right: 40,
      // backgroundColor: "green",
    },
    controlOption: {
      flex: 1,
      width: 30,
      height: 30,
    },
  }),
  error: StyleSheet.create({
    container: {
      backgroundColor: "rgba( 0, 0, 0, 0.5 )",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      marginBottom: 16,
    },
    text: {
      backgroundColor: "transparent",
      color: "#f27474",
    },
  }),
  loader: StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
  controls: StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: null,
      width: null,
    },
    column: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: null,
      width: null,
    },
    vignette: {
      resizeMode: "stretch",
    },
    control: {
      padding: 16,
    },
    text: {
      backgroundColor: "transparent",
      color: "#FFF",
      fontSize: 14,
      textAlign: "center",
    },
    pullRight: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    top: {
      flex: 1,
      alignItems: "stretch",
      justifyContent: "flex-start",
    },
    bottom: {
      alignItems: "stretch",
      flex: 2,
      justifyContent: "flex-end",
    },
    topControlGroup: {
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      width: null,
      margin: 12,
      marginBottom: 18,
    },
    bottomControlGroup: {
      alignSelf: "stretch",
      alignItems: "center",
      justifyContent: "space-between",
      marginLeft: 12,
      marginRight: 12,
      marginBottom: 0,
    },
    volume: {
      flexDirection: "row",
    },
    fullscreen: {
      flexDirection: "row",
    },
    playPause: {
      position: "relative",
      width: 80,
      zIndex: 0,
    },
    title: {
      alignItems: "center",
      flex: 0.6,
      flexDirection: "column",
      padding: 0,
    },
    titleText: {
      textAlign: "center",
    },
    timer: {
      width: 200,
    },
    timerText: {
      backgroundColor: "transparent",
      color: "#dedede",
      fontSize: 14,
      textAlign: "right",
      fontWeight: "bold",
    },
    back: {
      marginLeft: 10,
      width: 45,
      height: 45,
    },
    play: {
      marginLeft: 6,
      width: 60,
      height: 60,
    },
  }),
  volume: StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
      height: 1,
      marginLeft: 20,
      marginRight: 20,
      width: 150,
    },
    track: {
      backgroundColor: "#545454",
      height: 3,
      marginLeft: 7,
    },
    fill: {
      backgroundColor: "#f17500",
      height: 4,
    },
    handle: {
      position: "absolute",
      marginTop: -24,
      marginLeft: -24,
      padding: 15,
    },
    icon: {
      marginLeft: 7,
      height: 30,
      width: 30,
      resizeMode: "contain",
    },
  }),
  seekbar: StyleSheet.create({
    container: {
      alignSelf: "stretch",
      height: 28,
      marginLeft: 20,
      marginRight: 20,
    },
    icon: {
      height: pxToDp(58),
      width: pxToDp(73),
      resizeMode: "stretch",
    },
    track: {
      // 未播放的进度条颜色
      backgroundColor: "#7a7a7a",
      height: 3,
      position: "relative",
      top: 14,
      width: "100%",
    },
    fill: {
      backgroundColor: "#FFF",
      height: 4,
      width: "100%",
    },
    handle: {
      position: "absolute",
      marginLeft: -7,
      height: 28,
      width: 28,
    },
    circle: {
      borderRadius: 12,
      position: "relative",
      top: 8,
      left: 8,
      height: 12,
      width: 12,
    },
  }),
};
