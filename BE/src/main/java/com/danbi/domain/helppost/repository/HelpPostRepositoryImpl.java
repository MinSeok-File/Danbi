package com.danbi.domain.helppost.repository;


import com.danbi.domain.help.entity.QHelp;
import com.danbi.domain.helppost.constant.State;
import com.danbi.domain.helppost.dto.HelpPostDetailQeuryDto;
import com.danbi.domain.helppost.dto.HelpPostFaceDto;
import com.danbi.domain.helppost.dto.HelpPostMatchedDto;
import com.danbi.domain.helppost.dto.HelpPostQueryDto;
import com.danbi.domain.helppost.entity.HelpPost;
import com.danbi.domain.helppost.entity.QHelpPost;
import com.danbi.domain.helppost.entity.QPositions;
import com.danbi.domain.member.entity.QMember;
import com.danbi.domain.point.entity.QPoint;
import com.danbi.domain.profile.entity.QProfile;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;


import static com.danbi.domain.help.entity.QHelp.help;
import static com.danbi.domain.helppost.entity.QHelpPost.helpPost;
import static com.danbi.domain.helppost.entity.QPositions.positions;
import static com.danbi.domain.member.entity.QMember.member;
import static com.danbi.domain.point.entity.QPoint.point;
import static com.danbi.domain.profile.entity.QProfile.profile;

@RequiredArgsConstructor
public class HelpPostRepositoryImpl implements HelpPostRepositoryCustom{

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<HelpPostQueryDto> search(String longitude, String latitude) {
        return jpaQueryFactory.select(Projections.constructor(HelpPostQueryDto.class,
                        helpPost.id, member.id, member.name, member.profileUrl, helpPost.caution,
                        positions.longitude, positions.latitude,
                        helpPost.startTime, helpPost.endTime, helpPost.faceFlag,
                        point.accumulateDewPoint
                ))
                .from(helpPost)
                .innerJoin(helpPost.positions, positions)
                .leftJoin(helpPost.member, member)
                .leftJoin(member.profile, profile)
                .leftJoin(profile.point, point)
                .where(
                        positions.latitude.between(subtractFromString(latitude), plusFromString(latitude)),
                        positions.longitude.between(subtractFromString(longitude),plusFromString(longitude))
                )
                .fetch();
    }

    @Override
    public List<HelpPostFaceDto> searchFace(String longitude, String latitude) {
        return jpaQueryFactory.select(Projections.constructor(HelpPostFaceDto.class,
                        helpPost.id, member.id, member.name, member.profileUrl, helpPost.caution,
                        positions.longitude, positions.latitude, helpPost.startTime, helpPost.endTime, point.accumulateDewPoint))
                .from(helpPost)
                .innerJoin(helpPost.positions, positions)
                .leftJoin(helpPost.member, member)
                .leftJoin(member.profile, profile)
                .leftJoin(profile.point, point)
                .where(
                        positions.latitude.between(subtractFromString(latitude), plusFromString(latitude)),
                        positions.longitude.between(subtractFromString(longitude),plusFromString(longitude)),
                        helpPost.faceFlag.eq(true)
                )
                .fetch();
    }

    private String subtractFromString(String str) {
        double number = Double.parseDouble(str);
        double result = number - 0.05;
        return String.valueOf(result);
    }

    private String plusFromString(String str) {
        double number = Double.parseDouble(str);
        double result = number + 0.05;
        return String.valueOf(result);
    }


    @Override
    public HelpPostDetailQeuryDto searchDetail(Long helpPostId) {
        return jpaQueryFactory.select(Projections.constructor(HelpPostDetailQeuryDto.class,
                        helpPost.id, member.id, member.name, member.profileUrl, point.accumulateDewPoint,
                        member.accuseStack, positions.latitude, positions.longitude, positions.addr,
                        positions.destLatitude, positions.destLongitude, positions.destAddr,
                        positions.meetLatitude, positions.destLongitude, positions.meetAddr,
                        helpPost.faceFlag, helpPost.reservationFlag, helpPost.content,
                        helpPost.startTime, helpPost.endTime, helpPost.caution, helpPost.category))
                .from(helpPost)
                .innerJoin(helpPost.positions, positions)
                .leftJoin(helpPost.member, member)
                .leftJoin(member.profile, profile)
                .leftJoin(profile.point, point)
                .where(
                        helpPost.id.eq(helpPostId)
                )
                .fetchOne();
    }


    @Override
    public HelpPostMatchedDto searchMatchedDetail(Long helpPostId) {

        QMember ipMember = new QMember("ipMember");
        QMember helperMember = new QMember("helperMember");
        QProfile ipProfile = new QProfile("ipProfile");
        QProfile helperProfile = new QProfile("helperProfile");
        QPoint ipPoint = new QPoint("ipPoint");
        QPoint helperPoint = new QPoint("helperPoint");

        return jpaQueryFactory.select(Projections.constructor(HelpPostMatchedDto.class,
                        helpPost.id,
                        ipMember.id, ipMember.name, ipMember.profileUrl,
                        ipPoint.accumulateDewPoint, ipMember.accuseStack,

                        helperMember.id, helperMember.name, helperMember.profileUrl,
                        helperPoint.accumulateDewPoint, helperMember.accuseStack,

                        positions.latitude, positions.longitude, positions.addr,
                        positions.destLatitude, positions.destLongitude, positions.destAddr,
                        positions.meetLatitude, positions.destLongitude, positions.meetAddr,

                        helpPost.faceFlag, helpPost.reservationFlag, helpPost.content,
                        helpPost.startTime, helpPost.endTime, helpPost.caution, helpPost.category))
                .from(helpPost)
                .innerJoin(helpPost.positions, positions)
                .leftJoin(help).on(helpPost.eq(help.helpPost))
                .leftJoin(helpPost.member, ipMember)
                .leftJoin(ipMember.profile, ipProfile)
                .leftJoin(ipProfile.point, ipPoint)

                .leftJoin(help.helper, helperMember)
                .leftJoin(helperMember.profile, helperProfile)
                .leftJoin(helperProfile.point, helperPoint)
                .where(
                        helpPost.id.eq(helpPostId),
                        helpPost.state.eq(State.MATCHED)
                )
                .fetchOne();
    }
}
