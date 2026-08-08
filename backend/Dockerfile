# Build Stage
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY build.gradle settings.gradle gradlew gradlew.bat /app/
COPY gradle /app/gradle

RUN chmod +x gradlew

COPY src /app/src
RUN ./gradlew clean bootJar --no-daemon

#Runtime Stage
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN useradd -u 2000 springadmin
USER springadmin

COPY --from=build /app/build/libs/senns-fortress-backend.jar senns-fortress-backend.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-Djava.security.egd=file:/dev/./urandom", "-jar", "senns-fortress-backend.jar"]

