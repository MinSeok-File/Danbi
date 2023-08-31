package com.danbi.api.helppost.dto.detailmatched;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HelperMatchedDto {

    private Long helperId;

    private String name;

    private String profileUrl;

    private Long accumulateDewPoint;

    private int accusePoint;
}
