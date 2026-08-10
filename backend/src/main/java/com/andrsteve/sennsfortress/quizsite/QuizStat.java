package com.andrsteve.sennsfortress.quizsite;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class QuizStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JsonBackReference
    private QuizSite quizSite;

    private Integer score;
}
