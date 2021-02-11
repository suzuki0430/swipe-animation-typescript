import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  ImageSourcePropType,
} from 'react-native';
import { Card, Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

type Props = {
  id: number;
  name: string;
  uri: ImageSourcePropType;
  goal: string;
};

export const Deck = ({ data }: { data: Props[] }) => {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
  LayoutAnimation.spring();

  const [index, setIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: string) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: string) => {
    const item = data[index];

    direction === 'right' ? onSwipeRight() : onSwipeLeft();
    position.setValue({ x: 0, y: 0 });
    setIndex((prevIndex) => prevIndex + 1);
  };

  const onSwipeRight = () => {};
  const onSwipeLeft = () => {};

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-120deg', '0deg', '120deg'],
  });

  return (
    <>
      {index >= data.length && <RenderNoMoreCards />}
      {data
        .map((item, i) => {
          if (i < index) {
            return null;
          }

          if (i === index) {
            return (
              <Animated.View
                key={item.id}
                style={[
                  {
                    ...position.getLayout(),
                    transform: [{ rotate }],
                  },
                  styles.cardStyle,
                ]}
                {...panResponder.panHandlers}
              >
                <RenderCards item={item} />
              </Animated.View>
            );
          }

          return (
            <Animated.View
              key={item.id}
              style={[styles.cardStyle, { top: 10 * (i - index) }]}
            >
              <RenderCards item={item} />
            </Animated.View>
          );
        })
        .reverse()}
    </>
  );
};

const RenderCards = ({ item }: { item: Props }) => {
  return (
    <Card key={item.id}>
      <Card.Title style={styles.titleStyle}>{item.name}</Card.Title>
      <Card.Divider />
      <Card.Image source={item.uri} />
      <Card.Divider />
      <Text style={styles.textStyle}>目標：{item.goal}</Text>
      <Button buttonStyle={styles.buttonStyle} title="プロフィールはこちら" />
    </Card>
  );
};

const RenderNoMoreCards = () => {
  return (
    <Card>
      <Card.Title style={styles.titleStyle}>終了</Card.Title>
      <Card.Divider />
      <Text style={styles.textStyle}>検索にかかった女優は以上です</Text>
      <Button buttonStyle={styles.buttonStyle} title="もっと女優を探す" />
    </Card>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
  titleStyle: { fontSize: 18 },
  textStyle: { marginBottom: 10, fontSize: 16 },
  buttonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
});
