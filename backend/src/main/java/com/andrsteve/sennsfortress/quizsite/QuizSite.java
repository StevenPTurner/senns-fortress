package com.andrsteve.sennsfortress.quizsite;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class QuizSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String link;
    private String image;
    private String imageAlt;
    private boolean lowQuality;

    @OneToOne(mappedBy = "quizSite", cascade = CascadeType.ALL)
    private QuizStat quizStat;
}
