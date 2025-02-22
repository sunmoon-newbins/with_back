package com.newbins.entity;

import lombok.*;

import java.time.LocalDateTime;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RouteEntity {
    private String route_num;        // 경로 식별 번호
    private String name;            // 작성자 이름
    private String profile;         // 작성자 프로필
    private String title;           // 경로 제목
    private int state;              // 경로 상태
    private int participant_count;   // 참가자 수
    private int current_user_count; // 현재 인원수
    private String picture;         // 사진 경로
    private LocalDateTime create_date; // 생성 날짜
    private LocalDateTime start_date;  // 시작 날짜
    private LocalDateTime end_date;    // 종료 날짜
    private String content;
}
