import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // The bcrypt hash from the database for the admin user
        String hashedPassword = "$2b$12$Zolg5CMHRtt4vDl2tdtHquQliHlxDY.6SOe2nw9aZHsjfi751TyMm";
        
        // The password we're trying to use
        String plainPassword = "admin123!";
        
        // Check if they match
        boolean matches = encoder.matches(plainPassword, hashedPassword);
        
        System.out.println("Password matches: " + matches);
        
        // Also let's generate a new hash to see what it would look like
        String newHash = encoder.encode(plainPassword);
        System.out.println("New hash for '" + plainPassword + "': " + newHash);
    }
}