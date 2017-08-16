import React, { Component } from 'react';
import {
  Easing,
  Animated,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
  LayoutAnimation,
  Platform,
  AppState,
  TouchableOpacity,
} from 'react-native';

import { PropTypes } from 'prop-types';

// TODO: RESOLVE NATIVE MODULE CANNOT BE NULL
//import BackgroundTask from 'react-native-background-task';

// BackgroundTask.define(() => {
//   console.log('Hello from a background task');
//   BackgroundTask.finish();
// });

const ViewPropTypesStyle = ViewPropTypes
  ? ViewPropTypes.style
  : View.propTypes.style;

const styles = StyleSheet.create({
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
  },
  innerCircle: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  leftWrap: {
    position: 'absolute',
    top: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#f00',
  },
});

function calcInterpolationValuesForHalfCircle1(animatedValue, { shadowColor }) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '180deg', '180deg', '180deg'],
  });

  const backgroundColor = shadowColor;
  return { rotate, backgroundColor };
}

function calcInterpolationValuesForHalfCircle2(
  animatedValue,
  { color, shadowColor },
) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '0deg', '180deg', '360deg'],
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: [color, color, shadowColor, shadowColor],
  });
  return { rotate, backgroundColor };
}

function calcInterpolationValuesForCircleRotate(animatedValue, { shadowColor }) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 25, 25, 50, 75, 75, 100],
    outputRange: ['0deg', '180deg', '180deg', '360deg', '360deg', '360deg', '360deg'],
  });

  const backgroundColor = shadowColor;
  return { rotate, backgroundColor };
}

function getInitialState(props) {
  const circleProgress = new Animated.Value(0);
  const circleProgressX2 = new Animated.Value(0);
  return {
    circleProgress,
    circleProgressX2,
    secondsElapsed: 0,
    text: props.updateText(0, props.seconds),
    interpolationValuesHalfCircle1: calcInterpolationValuesForHalfCircle1(
      circleProgress,
      props,
    ),
    interpolationValuesHalfCircle2: calcInterpolationValuesForHalfCircle2(
      circleProgress,
      props,
    ),
    interpolationValuesCircleRotate: calcInterpolationValuesForCircleRotate(
      circleProgressX2,
      props,
    ),
    w1Anim: new Animated.Value((props.radius * 2) + 60),
    h1Anim: new Animated.Value((props.radius * 2) + 60),
    w2Anim: new Animated.Value(0),
    h2Anim: new Animated.Value(0),
    bounceValue: new Animated.Value(0),
    timerScale: new Animated.Value(1),
    active: true,
  };
}

const secondsToHms = (d: number) : string => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  let hDisplay = h > 0 ? h : '';
  let mDisplay = m > 0 ? m : '';
  let sDisplay = s > 0 ? s : '';
  return ((m > 9) ? m : '0' + m) + ':' + ((s > 9) ? s : '0' + s);
};

class TextTimeComponent extends Component {

  static propTypes = {
    textStyle: Text.propTypes.style,
    subTextStyle: Text.propTypes.style,
    seconds: PropTypes.number.isRequired,
    reverseCount: PropTypes.bool,
    onTimeElapsed: PropTypes.func,
    active: PropTypes.bool,
    isPausable: PropTypes.bool,
  };

  static defaultProps = {
    textStyle: null,
    subTextStyle: null,
    seconds: 10,
    onTimeElapsed: () => null,
    isPausable: false,
    active: true,
  };

  isStarted = false;

  constructor(props) {
    super(props);

    this.state = getInitialStateText(props);
  };

  componentDidMount = () => {
    this.refreshTime();
  };

  componentWillUnmount = () => {
    this.state.timeProgress.stopAnimation();
  };

  refreshTime = () => {

    Animated.timing(this.state.timeProgress, {
      toValue: 100,
      duration: 1000,
      easing: Easing.linear,
    }).start(this.updateTime);

  };

  updateTime = () => {
    const timeReverse = (this.props.reverseCount) ? this.state.timeReverse + 1 : 0;
    const time = (this.props.reverseCount) ? this.state.time + 1 : this.state.time - 1;
    const timeText = (this.props.reverseCount) ? secondsToHms(timeReverse) : secondsToHms(time);
    let callback = (time <= 0) ? this.props.onTimeElapsed : this.refreshTime;
    this.setState({
      ...getInitialStateText(this.props),
      time,
      timeReverse,
      timeText,
    }, callback);

  };

  renderSubText() {
    const { time, active } = this.props;

    if(this.props.isPausable) {
      return (
        <Text style={[ this.props.subTextStyle, active ? { opacity: 0.8, } : { opacity: 1, } ]}>{active ? 'Pause' : 'Resume'}</Text>
      );
    } else {
      return (<View></View>);
    }
  };

  render() {
    const { time, active } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
        <Text style={[ this.props.textStyle, active ? { opacity: 1, } : { opacity: 0.8, } ]}>{this.state.timeText}</Text>
        {this.renderSubText()}
      </View>
    );
  }
};

function getInitialStateText(props) {
  const timeProgress = new Animated.Value(0);
  return {
    timeProgress,
    time: props.seconds,
    timeReverse: 0,
    timeText: (props.reverseCount) ? secondsToHms(0) : secondsToHms(props.seconds),
    reverseCount: props.reverseCount,
    active: props.active,
  };
}

export default class PercentageCircle extends Component {
  static propTypes = {
    seconds: PropTypes.number.isRequired,
    beat: PropTypes.bool,
    reverseCount: PropTypes.bool,
    radius: PropTypes.number.isRequired,
    color: PropTypes.string,
    shadowColor: PropTypes.string,
    bgColor: PropTypes.string,
    bgColorSecondary: PropTypes.string,
    bgColorThirt: PropTypes.string,
    borderWidth: PropTypes.number,
    containerStyle: ViewPropTypesStyle,
    textStyle: Text.propTypes.style,
    subTextStyle: Text.propTypes.style,
    updateText: PropTypes.func,
    onTimeElapsed: PropTypes.func,
    minScale: PropTypes.number,
    maxScale: PropTypes.number,
    onPause: PropTypes.func,
    onResume: PropTypes.func,
    isPausable: PropTypes.bool,
  };

  static defaultProps = {
    color: '#f00',
    shadowColor: '#999',
    bgColor: '#e9e9ef',
    bgColorSecondary: '#e9e9ef',
    bgColorThirt: '#e9e9ef',
    borderWidth: 2,
    seconds: 10,
    beat: false,
    reverseCount: false,
    children: null,
    containerStyle: null,
    textStyle: null,
    subTextStyle: null,
    onTimeElapsed: () => null,
    updateText: (elapsedSeconds, totalSeconds) =>
      (totalSeconds - elapsedSeconds).toString(),
    minScale: 0.9,
    maxScale: 1.2,
    onPause: () => null,
    onResume: () => null,
    isPausable: false,
  };

  constructor(props) {
    super(props);

    this.state = getInitialState(props);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(getInitialState(nextProps), this.restartAnimation);
  }

  restartAnimation = () => {
    let self = this;
    self.state.circleProgress.stopAnimation();
    self.state.circleProgressX2.stopAnimation();

    Animated.timing(self.state.circleProgress, {
      toValue: 100,
      duration: self.state.text * 1000,
      easing: Easing.linear,
    }).start();

    Animated.timing(self.state.circleProgressX2, {
      toValue: 100,
      duration: (self.state.text * 1000) * 2,
      easing: Easing.linear,
    }).start();

  };

  renderCircle({ rotate, backgroundColor }) {
    const { radius } = this.props;

    return (
      <View
        style={[
          styles.leftWrap,
          {
            left: radius,
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <Animated.View
          style={[
            {
              left: -radius,
              width: radius,
              height: radius * 2,
              transform: [
                { translateX: radius / 2 },
                { rotate },
                { translateX: -radius / 2 },
              ],
            },
          ]}
        >
          <View style={[
            {
              left: radius - (radius / 16),
              top: -(radius / 16),
              width: radius / 5,
              height: radius / 5,
              borderRadius: radius / 5,
              borderWidth: (radius / 20),
              borderColor: 'rgba(161, 26, 66, 1)',
              backgroundColor: '#FFF',
            },
          ]} />
        </Animated.View>
      </View>
    );

  }

  renderHalfCircle({ rotate, backgroundColor }) {
    const { radius } = this.props;

    return (
      <View
        style={[
          styles.leftWrap,
          {
            left: radius,
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.halfCircle,
            {
              left: -radius,
              width: radius,
              height: radius * 2,
              borderRadius: radius,
              backgroundColor,
              transform: [
                { translateX: radius / 2 },
                { rotate },
                { translateX: -radius / 2 },
              ],
            },
          ]}
        />
      </View>
    );
  }

  renderInnerCircle() {
    const radiusMinusBorder = this.props.radius - this.props.borderWidth;
    return (
      <View
        style={[
          styles.innerCircle,
          {
            width: radiusMinusBorder * 2,
            height: radiusMinusBorder * 2,
            borderRadius: radiusMinusBorder,
            backgroundColor: this.props.bgColor,
            ...this.props.containerStyle,
          },
        ]}
      >
        <TextTimeComponent
          textStyle={this.props.textStyle}
          subTextStyle={this.props.subTextStyle}
          seconds={this.props.seconds}
          onTimeElapsed={this.props.onTimeElapsed}
          active={this.state.active}
          isPausable={this.props.isPausable}
          reverseCount={this.props.reverseCount}
        />
      </View>
    );
  }

  componentDidMount() {
    this.beat();
    this.restartAnimation();
  }

  toogleAnimation() {
    const active = !this.state.active;
    //onPause
    this.setState({
      ...getInitialStateText(this.props),
      active,
    }, () => {
      if(active) {
        if(parseFloat(JSON.stringify(this.state.bounceValue)) == this.props.minScale){
          this.beat();
          this.props.onResume.call(this);
        }
      }
    });
  }

  beat() {
    if (this.state.active) {

      Animated.sequence([
        Animated.timing(
          this.state.bounceValue,
          {
            duration: 272.5,
            toValue: this.props.maxScale,
          }
        ),
        Animated.timing(
          this.state.bounceValue,
          {
            duration: 272.5,
            toValue: this.props.minScale,
          }
        ),
      ]).start(() => {
        this.state.bounceValue.stopAnimation();
        if (this.state.active) {
          this.beat();
        } else {
          this.props.onPause.call(this);
        }
      });
    }
  }

  render() {
    const {
      interpolationValuesHalfCircle1,
      interpolationValuesHalfCircle2,
      interpolationValuesCircleRotate,
      w1Anim,
      h1Anim,
      w2Anim,
      h2Anim,
      bounceValue,
      timerScale,
    } = this.state;

    return (
      <Animated.View style={{
        width: (this.props.radius * 2),
        height: (this.props.radius * 2),
        transform: [
          { scale: timerScale },
        ],
      }}>
        <Animated.View
          style={[
            styles.outerCircle,
            {
              position: 'absolute',
              left: -30,
              top: -30,
              width: (this.props.radius * 2) + 60,
              height: (this.props.radius * 2) + 60,
              borderRadius: ((this.props.radius * 2) + 50) * 40,
              backgroundColor: this.props.bgColorThirt,
              transform: [
                { scale: bounceValue },
              ],
              opacity: this.props.beat ? 1 : 0,
            },
          ]}
        >
          <View
            style={[
              styles.outerCircle,
              {
                width: (this.props.radius * 2) + 30,
                height: (this.props.radius * 2) + 30,
                borderRadius: ((this.props.radius * 2) + 50) * 40,
                backgroundColor: this.props.bgColorSecondary,
              },
            ]}
          >
          </View>
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.outerCircle,
            {
              position: 'absolute',
              left: 0,
              top: 0,
              width: this.props.radius * 2,
              height: this.props.radius * 2,
              borderRadius: this.props.radius,
              backgroundColor: this.props.color,
            },
          ]}
          onPress={ () => this.toogleAnimation() }
        >
          {this.renderHalfCircle(interpolationValuesHalfCircle1)}
          {this.renderHalfCircle(interpolationValuesHalfCircle2)}
          {this.renderInnerCircle()}
          {this.renderCircle(interpolationValuesCircleRotate)}
        </TouchableOpacity>
      </Animated.View>

    );
  }
}
