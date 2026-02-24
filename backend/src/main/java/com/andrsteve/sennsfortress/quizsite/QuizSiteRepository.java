package com.andrsteve.sennsfortress.quizsite;

import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface QuizSiteRepository extends ListCrudRepository<QuizSite, Integer> {
    List<QuizSite> findAllByLowQuality(boolean lowQuality);
}
