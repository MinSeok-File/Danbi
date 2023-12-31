package com.danbi.domain.friend.entity;

import com.danbi.domain.common.BaseEntity;
import com.danbi.domain.friend.constant.State;
import com.danbi.domain.friend.constant.Type;
import com.danbi.domain.member.entity.Member;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Friend extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "friend_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_member_id")
    private Member from;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_member_id")
    private Member to;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private State state;

    @Builder
    public Friend(Long id, Member from, Member to, Type type, State state) {
        this.from = from;
        this.to = to;
        this.type = type;
        this.state = state;
    }

    public void update(Friend friend) {
        this.from = friend.getFrom();
        this.to = friend.getTo();
        this.type = friend.getType();
        this.state = friend.getState();
    }

    public void delete() {
        this.state = State.DESTROY;
    }

}
