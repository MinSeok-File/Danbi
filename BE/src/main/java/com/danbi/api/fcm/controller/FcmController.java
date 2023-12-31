package com.danbi.api.fcm.controller;

import com.danbi.api.ApiResponse;
import com.danbi.api.fcm.dto.FcmRequestDto;
import com.danbi.domain.fcm.dto.NotificationRequest;
import com.danbi.domain.fcm.service.FcmService;
import com.danbi.global.resolver.memberinfo.MemberInfo;
import com.danbi.global.resolver.memberinfo.MemberInfoDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequestMapping("/api/v1/fcm")
@RequiredArgsConstructor
public class FcmController {

    private final FcmService fcmService;

    @PostMapping("/token")
    public ApiResponse<String> registerToken(@MemberInfo MemberInfoDto memberInfoDto, @RequestBody FcmRequestDto fcmRequestDto) {
        fcmService.saveToken(memberInfoDto.getMemberId(), fcmRequestDto.getFcmToken());
        return ApiResponse.ok(fcmRequestDto.getFcmToken());
    }

    @PostMapping("/sendMessageTo")
    public ApiResponse<String> sendMessageTo(@RequestBody NotificationRequest notificationRequest) throws IOException, ExecutionException, InterruptedException {
        fcmService.sendMessageTo(notificationRequest);
        return ApiResponse.ok("메시지 전송을 성골했습니다.");
    }

}
