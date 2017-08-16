# react-native-timekeeper

Timekeeper is the most complete and lightweight component for React-Native that allows you to create your own animated timer.

## Features!

  - Custom colors
  - Custom borders and size
  - Light-weight: No other dependencies besides react-native
  - Enable/disable scale bounce animation (also specifies the size of the scales)
  - Progressive or regressive counting
  - Enable/disable pausable timer
  - Apply your own callbacks on pausing, on resuming, or time elapsed

<img src="http://i.imgur.com/6KXN7jG.png" width="250">

### Installation

```sh
$ yarn add react-native-timekeeper
```

or

```sh
$ npm install react-native-timekeeper --save
```

### Usage

```javascript
import Timer from 'react-native-timekeeper';

render() {
    return(
        <Timer
          beat={true}
          seconds={120}
          radius={100}
          borderWidth={6}
          color="#C52957"
          bgColor="#DE537C"
          bgColorSecondary="#E495AC"
          bgColorThirt="#EFD6DE"
          shadowColor="#DE537C"
          textStyle={{ fontSize: 52, color: '#FFF', }}
          subTextStyle={{ fontSize: 20, color: '#FFF', }}
          onTimeElapsed={() => {console.log('Time elapsed')} }
          isPausable={true}
          onPause={() => console.log('Pause')}
          onResume={() => console.log('Resume')}
          minScale={0.9}
          maxScale={1.2}
          />
    );
}
```

### Props

| Name | Description | Type | Required | Default Value
| ----------- | ----------- | ----------- | ----------- | ----------- |
| beat | ----------- | ----------- | ----------- | ----------- |
| seconds | ----------- | ----------- | ----------- | ----------- |
| radius | ----------- | ----------- | ----------- | ----------- |
| borderWidth | ----------- | ----------- | ----------- | ----------- |
| color | ----------- | ----------- | ----------- | ----------- |
| bgColor | ----------- | ----------- | ----------- | ----------- |
| bgColorSecondary | ----------- | ----------- | ----------- | ----------- |
| bgColorThirt | ----------- | ----------- | ----------- | ----------- |
| shadowColor | ----------- | ----------- | ----------- | ----------- |
| textStyle | ----------- | ----------- | ----------- | ----------- |
| subTextStyle | ----------- | ----------- | ----------- | ----------- |
| onTimeElapsed | ----------- | ----------- | ----------- | ----------- |
| isPausable | ----------- | ----------- | ----------- | ----------- |
| onPause | ----------- | ----------- | ----------- | ----------- |
| onResume | ----------- | ----------- | ----------- | ----------- |
| minScale | ----------- | ----------- | ----------- | ----------- |
| maxScale | ----------- | ----------- | ----------- | ----------- |


### Author

[Yamil Diaz Aguirre](https://github.com/Yamilquery)

Want to contribute? Great!
