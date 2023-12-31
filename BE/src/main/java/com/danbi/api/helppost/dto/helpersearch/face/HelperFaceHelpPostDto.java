package com.danbi.api.helppost.dto.helpersearch.face;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HelperFaceHelpPostDto {

    private Long helpPostId;

    private Long ipId;

    private Position position;

    private String name;

    private String profileUrl;

    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime endTime;

    private boolean emergencyFlag;

    private int accuseStack;

    private boolean friendFlag;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Position {
        private String meetLatitude;
        private String meetLongitude;
        private String meetAddr;
    }
}
