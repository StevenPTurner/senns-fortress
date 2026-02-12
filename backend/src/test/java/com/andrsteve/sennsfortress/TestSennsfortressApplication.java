package com.andrsteve.sennsfortress;

import org.springframework.boot.SpringApplication;

public class TestSennsfortressApplication {

	public static void main(String[] args) {
		SpringApplication.from(SennsfortressApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
