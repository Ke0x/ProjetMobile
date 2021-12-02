import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Animated,
  StyleSheet,
  Text as RnText,
} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {Svg, Path, G, Text, TSpan} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import {snap} from '@popmotion/popcorn';

const {width} = Dimensions.get('screen');

const numberOfSegments = 2;
const wheelSize = width * 0.95;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = 'red';

const makeWheel = ({movieData}: {movieData: any}) => {
  //const data: any = Array.from({length: numberOfSegments}).fill(1);
  const arcs: any = d3Shape.pie()(movieData);

  return arcs.map((arc: any, index: any) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);

    console.log(arc);
    return {
      path: instance(arc),
      color: 'red',
      value: arc.data.title, //[200, 2200]
      centroid: instance.centroid(arc),
    };
  });
};

const Wheel = ({navigation, route}: {navigation: any; route: any}) => {
  const movieData = route.params;

  const _wheelPaths = makeWheel(movieData);
  const _angle = new Animated.Value(0);

  const [angle, setAngle] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    console.log('reload');
    _angle.addListener(event => {
      if (enabled) {
        setEnabled(false);
        setFinished(false);
      }

      setAngle(event.value);
    });
  }, []);

  const _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(angle % oneTurn));
    return Math.floor(deg / angleBySegment);
  };

  const _onPan = ({nativeEvent}: {nativeEvent: any}) => {
    if (nativeEvent.state === State.END) {
      const {velocityY} = nativeEvent;

      Animated.decay(_angle, {
        velocity: velocityY / 1000,
        deceleration: 0.999,
        useNativeDriver: true,
      }).start(() => {
        _angle.setValue(angle % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);
        Animated.timing(_angle, {
          toValue: snapTo(angle),
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          const winnerIndex = _getWinnerIndex();
          setEnabled(true);
          setFinished(true);
          setWinner(_wheelPaths[winnerIndex].value);
        });
        // do something here;
      });
    }
  };

  const _renderKnob = () => {
    const knobSize = 30;
    // [0, numberOfSegments]
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(_angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment),
      ),
      1,
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: [
                  '0deg',
                  '0deg',
                  '35deg',
                  '-35deg',
                  '0deg',
                  '0deg',
                ],
              }),
            },
          ],
        }}>
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{transform: [{translateY: 8}]}}>
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={'green'}
          />
        </Svg>
      </Animated.View>
    );
  };

  const _renderWinner = () => {
    return <RnText style={styles.winnerText}>Winner is: {winner}</RnText>;
  };

  const _renderSvgWheel = () => {
    return (
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            {
              rotate: _angle.interpolate({
                inputRange: [-oneTurn, 0, oneTurn],
                outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
              }),
            },
          ],
        }}>
        <Svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${width} ${width}`}
          style={{transform: [{rotate: `-${angleOffset}deg`}]}}>
          <G y={width / 2} x={width / 2}>
            {_wheelPaths.map((arc: any, i: number) => {
              const [x, y] = arc.centroid;
              const number = arc.value.toString();

              return (
                <G key={`arc-${i}`}>
                  <Path d={arc.path} fill={arc.color} />
                  <G
                    rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                    origin={`${x}, ${y}`}>
                    <Text
                      x={x}
                      y={y - 70}
                      fill="white"
                      textAnchor="middle"
                      fontSize={fontSize}>
                      {Array.from({length: number.length}).map((_, j) => {
                        return (
                          <TSpan
                            x={x}
                            dy={fontSize}
                            key={`arc-${i}-slice-${j}`}>
                            {number.charAt(j)}
                          </TSpan>
                        );
                      })}
                    </Text>
                  </G>
                </G>
              );
            })}
          </G>
        </Svg>
      </Animated.View>
    );
  };

  return (
    <PanGestureHandler onHandlerStateChange={_onPan} enabled={enabled}>
      <View style={styles.container}>
        {_renderKnob()}

        {_renderSvgWheel()}
        {finished && enabled && _renderWinner()}
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerText: {
    fontSize: 32,
    fontFamily: 'Menlo',
    position: 'absolute',
    bottom: 10,
  },
});

export default Wheel;
