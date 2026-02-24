package com.andrsteve.sennsfortress;

import com.andrsteve.sennsfortress.listsite.ListSite;
import com.andrsteve.sennsfortress.listsite.ListSiteRepository;
import com.andrsteve.sennsfortress.quizsite.QuizSite;
import com.andrsteve.sennsfortress.quizsite.QuizSiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class MainController {

    private final ListSiteRepository listSiteRepository;
    private final QuizSiteRepository quizSiteRepository;

    @GetMapping(path = "/list/site")
    public ResponseEntity<List<ListSite>> findAllListSites(@RequestParam(defaultValue = "false") boolean excludeLowQuality) {
        List<ListSite> listSites = excludeLowQuality ? listSiteRepository.findAllByLowQuality(false) : listSiteRepository.findAll();
        return ResponseEntity.ok(listSites);
    }

    @GetMapping(path = "/list/quiz")
    public ResponseEntity<List<QuizSite>> findAllQuizSites(@RequestParam(defaultValue = "false") boolean excludeLowQuality) {
        List<QuizSite> quizSites = excludeLowQuality ? quizSiteRepository.findAllByLowQuality(false) : quizSiteRepository.findAll();
        return ResponseEntity.ok(quizSites);
    }

    @GetMapping(path = "/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("API is up and running!");
    }
}
