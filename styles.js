// @flow
import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  outerBeaterAnimation: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
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
