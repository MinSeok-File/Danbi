package com.danbi.domain.comment.service;

import com.danbi.domain.comment.entity.Comment;
import com.danbi.domain.comment.repository.CommentRepository;
import com.danbi.domain.guestbook.entity.GuestBook;
import com.danbi.global.error.ErrorCode;
import com.danbi.global.error.exception.CommentNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> findByGuestBook(GuestBook guestBook) {
        return commentRepository.findCommentsByGuestBook(guestBook);
    }

    public Comment findById(Long commentId) {
        Optional<Comment> op = commentRepository.findById(commentId);

        if (op.isEmpty()) {
            throw new CommentNotFoundException(ErrorCode.COMMENT_NOT_EXISTS);
        }
        return op.get();
    }

    @Transactional
    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment modifyContent(Comment comment, String content) {
        comment.updateContent(content);
        return comment;
    }

    @Transactional
    public void deleteComment(Comment comment) {
        commentRepository.delete(comment);
    }

}
