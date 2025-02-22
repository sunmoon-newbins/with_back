import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "관광명소, 식당, 숙소 검색",
}) {
  // onSubmit 은 엔터쳤을 때
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder} // 글자 적기전 뭐 적어달라고 써져있는거.
        placeholderTextColor="rgba(0, 0, 0, 0.3)" // 그냥 검은색에 70% 투명도
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit} // 엔터(완료) 버튼을 눌렀을 때 실행될 함수
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F8FB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 8, // 추가: 위아래 여백을 추가하여 높이 조정
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    height: 40, // 추가: TextInput 높이를 설정하여 더 크게 만듦
  },
});

export default SearchBar;
