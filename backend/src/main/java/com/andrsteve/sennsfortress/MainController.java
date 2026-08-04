package com.andrsteve.sennsfortress;

import com.andrsteve.sennsfortress.authentication.AuthenticationService;
import com.andrsteve.sennsfortress.authentication.models.AuthRequest;
import com.andrsteve.sennsfortress.authentication.models.AuthResponse;
import com.andrsteve.sennsfortress.listsite.ListSite;
import com.andrsteve.sennsfortress.listsite.ListSiteRepository;
import com.andrsteve.sennsfortress.quizsite.QuizSite;
import com.andrsteve.sennsfortress.quizsite.QuizSiteRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.andrsteve.sennsfortress.authentication.AuthProvider.GOOGLE;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class MainController {

    private final ListSiteRepository listSiteRepository;
    private final QuizSiteRepository quizSiteRepository;
    private final AuthenticationService authService;

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


    @PostMapping("/auth/google")
    public ResponseEntity<AuthResponse> authenticateWithGoogle(@Valid @RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(
                authService.authenticate(GOOGLE, authRequest.getToken())
        );
    }
}
