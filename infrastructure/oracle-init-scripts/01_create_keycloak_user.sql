-- Create Keycloak user if it doesn't exist
DECLARE user_exists NUMBER := 0;

BEGIN -- Check if user exists
SELECT
  COUNT(*) INTO user_exists
FROM
  all_users
WHERE
  username = UPPER('&KEYCLOAK_DB_USER');

IF user_exists = 0 THEN EXECUTE IMMEDIATE 'CREATE USER ' || '&KEYCLOAK_DB_USER' || ' IDENTIFIED BY ''' || '&KEYCLOAK_DB_PASSWORD' || '''';

EXECUTE IMMEDIATE 'GRANT CONNECT, RESOURCE TO ' || '&KEYCLOAK_DB_USER';

-- EXECUTE IMMEDIATE 'GRANT DBA TO ' || '&KEYCLOAK_DB_USER';
END IF;

END;

/