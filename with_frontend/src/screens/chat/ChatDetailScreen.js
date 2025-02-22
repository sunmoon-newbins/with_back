// src/screens/ChatDetailScreen.js

import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { io } from "socket.io-client";

import MessageList from "../../components/chat/MessageList"; // MessageList 컴포넌트 가져오기
import ChatTextInput from "../../components/chat/ChatTextInput"; // ChatTextInput 컴포넌트 가져오기
import IPConfig from "../../configs/IPConfig.json";

import useStore from "../../components/user/useStore";

const dummyImage = require("../../../assets/BoarderDummy.png");

const ChatDetailScreen = () => {
  const [socket, setSocket] = useState();
  const userId = useStore((state) => state.userId);

  const route = useRoute();
  const navigation = useNavigation();
  console.log(
    "{ChatDetailScreen} route.params : ",
    JSON.stringify(route.params)
  );
  const {
    users,
    messages,
    title,
    currentUserCount,
    picture,
    routeId,
    chattingId,

    startDate,
    endDate,
    writerName,

    // 시작 , 종료, 작가
  } = route.params; // Id는 필요시 백엔드 통신에 사용
  const [messageList, setMessageList] = useState(messages);

  //  방장 이름
  //  시작일 - 종료일

  // useLayoutEffect를 사용하여 네비게이션 옵션을 설정
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.headerText}>{title}</Text>
          <Text
            style={[
              styles.headerText,
              { paddingLeft: 10, display: "Block", marginTop: 4 },
            ]}
          >
            {currentUserCount}
          </Text>
        </View>
      ), // headerTitle을 함수로 설정하여 <Text> 컴포넌트 사용

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerLeftButton}
        >
          <Image
            source={require("../../../assets/BackIcon.png")} // 나가기(뒤로가기) 아이콘의 경로에 맞게 수정
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // users 값을 route.params로 설정 후 드로어 열기
            console.log("{ChatDetailScreen}, headerRight / users :", users);
            navigation.navigate("ChatDetailNavigator", {
              users: users, // users 데이터를 route.params로 넘김
            });
            navigation.openDrawer(); // 드로어 열기
          }}
        >
          <Image
            source={require("../../../assets/chatMenu.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title]); // 네비게이션이나 제목이 바뀔 때 마다 헤더 타이틀이 바뀜. 저 타이틀로 , 그러니까 목록에서 선택한 제목이 헤더로 딸려옴

  useEffect(() => {
    const newSocket = new WebSocket(
      IPConfig.IP + `/users/${userId}/chatting/${chattingId}/ws`
    );

    newSocket.onmessage = function (event) {
      // JSON 문자열을 객체로 변환
      const parsedData = JSON.parse(event.data);

      const newMessage = {
        // 새로운 메시지
        content: parsedData.content,
        sendDate: parsedData.sendDate,
        unreadCount: parsedData.unreadCount,
        userId: parsedData.userId,
      };

      setMessageList((prevMessageList) => [...prevMessageList, newMessage]); // 원래 메시지 리스트에 추가한다
    };
    setSocket(newSocket); // useState 웹소켓 넣고
  }, []);

  const sendMessage = async (message) => {
    try {
      if (socket) {
        socket.send(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 새로운 메시지 추가 함수
  const addMessage = (newMessage) => {
    sendMessage(newMessage);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined} // iOS에서는 키보드가 올라올 때 입력창이 가려지지 않도록 패딩 추가
      keyboardVerticalOffset={0} // 헤더가 있을 경우 적절한 값으로 조정
    >
      {/* 게시판 상세보기 */}

      {/* 상세 게시글로 가기 */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("RouteDetailScreen", {postId : routeId});
        }}
      >
        <View
          style={{
            marginTop: 10,
            height: 60,
            backgroundColor: "#F4F8FB",
            marginHorizontal: 30,
            marginBottom: 0,
            borderRadius: 10,
            flexDirection: "row", // 가로로 배치
            alignItems: "center",
            borderColor: "#CCC",
            padding: 10,
            borderWidth: 1,
          }}
        >
          <View
            style={{
              width: "20%",
              height: "90%",
              marginRight: 10,
              backgroundColor: "lightgray",
              alignItems: "center", // 가로
              justifyContent: "center",
            }}
          >
            {picture ? (
              <Image
                source={{ uri: picture }} // imageUrl이 없으면 로컬 이미지 사용
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={{ fontSize: 6, color: "gray" }}>
                이미지가 없습니다.
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>게시판 상세보기</Text>

            {/* 날짜 부분 */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ opacity: 0.7 }}>작성자{writerName}</Text>
              {/* roo */}
              <Text style={{ opacity: 0.7 }}>
                {startDate} - {endDate}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.messageListContainer}>
        <MessageList messages={messageList} users={users} />
      </View>
      <View style={styles.chatInputContainer}>
        <ChatTextInput onSendMessage={addMessage} />
        {/* ChatTextInput 컴포넌트 추가 */}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8",
  },
  messageListContainer: {
    flex: 1,
    padding: 18,
  },
  headerLeftButton: {
    paddingLeft: 10, // 왼쪽에 여백을 추가하여 터치 영역 확대
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 10, // 헤더 오른쪽 여백 설정
  },
  headerText: {
    fontSize: 18, // 기본 헤더 텍스트 크기
    fontWeight: "600", // semi-bold에 가까운 굵기
    color: "#000", // 헤더 텍스트 색상
    marginBottom: 5,
  },
  chatInputContainer: {
    padding: 5, // 내부 여백 제거
    margin: 0, // 외부 여백 제거
    backgroundColor: "#ffffff", // 필요 시 배경색 설정
  },
});

export default ChatDetailScreen;
