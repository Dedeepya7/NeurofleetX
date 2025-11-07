@echo off
echo Setting up NeuroFleetX database...
echo Please enter your MySQL root password when prompted
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < setup-database.sql
echo Database setup completed!
pause