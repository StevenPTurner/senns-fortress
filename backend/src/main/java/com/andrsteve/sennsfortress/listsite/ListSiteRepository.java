package com.andrsteve.sennsfortress.listsite;

import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface ListSiteRepository extends ListCrudRepository<ListSite, Integer> {
    List<ListSite> findAllByLowQuality(boolean lowQuality);
}
