// @flow
import * as React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// const ViewPropTypesStyle = ViewPropTypes
//   ? ViewPropTypes.style
//   : View.propTypes.style;

const styles = StyleSheet.create({
  textBase: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

type Props = {
  active: boolean,
  isPausable?: boolean,
  onTimeElapsed: Function,
  reverseCount: boolean,
  seconds: number,
  startAt: number,
  subTextStyle: Text.propTypes.style | Array<Text.propTypes.style>,
  textStyle: Text.propTypes.style | Array<Text.propTypes.style>,
}

type Default = {
  active: boolean,
  isPausable: boolean,
  onTimeElapsed: Function,
  seconds: number,
  startAT: number,
  subTextStyle: Text.propTypes.style | Array<Text.propTypes.style>,
  textStyle: Text.propTypes.style | Array<Text.propTypes.style>,
}

type State = {
  active: boolean,
  reverseCount: boolean,
  timeProgress: any,
  timeText: string,
  timeReverse: any,
  time: any,
};

const secondsToHms = (rd: number): string => {
  const d = Number(rd);
  // const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  // const hDisplay = h > 0 ? h : '';
  const mDisplay = m > 9 ? m : `0${m}`;
  const sDisplay = s > 9 ? s : `0${s}`;
  return `${mDisplay}:${sDisplay}`;
};

export function getInitialStateText(props: Props): State {
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

export default class TextTimeComponent extends React.Component<Default, Props, State> {
  static defaultProps = {
    active: true,
    isPausable: false,
    onTimeElapsed: () => null,
    seconds: 10,
    subTextStyle: null,
    textStyle: null,
  }

  constructor(props: Props) {
    super(props);
    // this.isStarted = false;
    this.state = getInitialStateText(props);
  }

  state: State = {
    ...getInitialStateText(this.props),
    timeReverse: this.props.startAt,
  }

  componentDidMount = () => {
    this.refreshTime();
    this.setState({
      timeReverse: this.props.startAt,
    });
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (nextProps.startAt > 0) {
      this.state.timeReverse = nextProps.startAt;
      this.setState({
        timeReverse: nextProps.startAt,
      });
    }
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
  }

  updateTime = () => {
    const timeReverse = (this.props.reverseCount)
      ? this.state.timeReverse + 1
      : 0;
    const time = (this.props.reverseCount) ? this.state.time + 1 : this.state.time - 1;
    const timeText = (this.props.reverseCount) ? secondsToHms(timeReverse) : secondsToHms(time);
    const callback = (time <= 0) ? this.props.onTimeElapsed : this.refreshTime;
    this.setState({
      ...getInitialStateText(this.props),
      time,
      timeReverse,
      timeText,
    }, callback);
  }

  renderSubText() {
    const { active } = this.props;

    if (this.props.isPausable) {
      return (
        <Text
          numberOfLines={1} ellipsizeMode="head"
          style={[this.props.subTextStyle, active ? { opacity: 0.8 } : { opacity: 1 }]}
        >
          {active ? 'Pause' : 'Resume'}
        </Text>
      );
    }

    return (<View />);
  }

  render() {
    const { active } = this.props;

    return (
      <View style={styles.textBase}>
        <Text
          numberOfLines={1} ellipsizeMode="head"
          style={[this.props.textStyle, active ? { opacity: 1 } : { opacity: 0.8 }]}
        >
          {this.state.timeText}
        </Text>
        {this.renderSubText()}
      </View>
    );
  }
}
