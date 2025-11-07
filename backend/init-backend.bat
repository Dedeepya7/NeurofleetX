@echo off
echo Initializing NeuroFleetX Backend...
echo This script will set up the Maven project and download dependencies.

cd /d "C:\Users\Dedeepya Ramidi\OneDrive\Documents\NeuroFleetX\backend"

echo Installing Maven dependencies...
mvn clean install

echo Starting the Spring Boot application...
mvn spring-boot:run

pause