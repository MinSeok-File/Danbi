package com.danbi.api.helppost.dto.detailsearch;

import com.danbi.domain.helppost.constant.Category;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetailHelpPostDto {

    private Long helpPostId;
    private IpDto ip;
    private Position position;
    private boolean faceFlag;
    private boolean emergencyFlag;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime startTime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime endTime;
    private boolean friendFlag;
    private boolean genderFlag;

    private String caution;
    private Category category;

    @Getter
    @Builder
    public static class Position {
        private String latitude;

        private String longitude;

        private String addr;

        private String destLatitude;

        private String destLongitude;

        private String destAddr;

        private String meetLatitude;

        private String meetLongitude;

        private String meetAddr;
    }
}
