package com.andrsteve.sennsfortress.listsite;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ListSite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String link;
    private String image;
    private String imageAlt;
    private boolean lowQuality;
}
