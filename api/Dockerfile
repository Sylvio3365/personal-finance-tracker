# --- Étape de Build ---
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Étape intermédiaire pour mettre en cache les dépendances Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et compiler l'application
COPY src ./src
RUN mvn package -DskipTests

# --- Étape d'Exécution ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copier le fichier JAR généré depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Port par défaut (Render écoutera sur le port défini par la variable d'environnement PORT)
ENV PORT=8080
EXPOSE 8080

# Lancement de l'application Spring Boot avec le port dynamique de Render
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT}"]
